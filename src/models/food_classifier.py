"""EfficientNet-B0 fine-tune on Food-101: train, log top-1/top-5 to MLflow,
export ONNX, and run cached inference.

    python -m src.models.food_classifier      # trains (needs GPU + manifest)
"""
from __future__ import annotations

import numpy as np

from src.config import CFG


def build_backbone():
    import timm

    return timm.create_model(CFG.food_model_name, num_classes=CFG.food_num_classes, pretrained=True)


def _loaders():
    import pandas as pd
    from PIL import Image
    from torch.utils.data import DataLoader, Dataset
    from torchvision import transforms

    df = pd.read_parquet(CFG.food_manifest)
    train_tf = transforms.Compose(
        [
            transforms.RandomResizedCrop(CFG.image_size, scale=(0.7, 1.0)),
            transforms.RandomHorizontalFlip(),
            transforms.ColorJitter(0.2, 0.2, 0.2),
            transforms.ToTensor(),
        ]
    )
    eval_tf = transforms.Compose(
        [transforms.Resize((CFG.image_size, CFG.image_size)), transforms.ToTensor()]
    )

    class FoodDS(Dataset):
        def __init__(self, frame, tf):
            self.frame = frame.reset_index(drop=True)
            self.tf = tf

        def __len__(self):
            return len(self.frame)

        def __getitem__(self, i):
            row = self.frame.iloc[i]
            return self.tf(Image.open(row["path"]).convert("RGB")), int(row["label"])

    def loader(split, tf, shuffle):
        return DataLoader(FoodDS(df[df["split"] == split], tf), CFG.food_batch_size, shuffle=shuffle, num_workers=2)

    classes = df.sort_values("label")["dish"].unique().tolist()
    return loader("train", train_tf, True), loader("val", eval_tf, False), classes


def _topk_acc(model, loader, device, k=5):
    import torch

    model.eval()
    top1 = top5 = total = 0
    with torch.no_grad():
        for x, y in loader:
            logits = model(x.to(device))
            _, idx = logits.topk(k, dim=1)
            y = y.to(device)
            top1 += (idx[:, 0] == y).sum().item()
            top5 += (idx == y[:, None]).any(dim=1).sum().item()
            total += y.numel()
    return top1 / total, top5 / total


def train():
    import mlflow
    import torch

    device = "cuda" if torch.cuda.is_available() else "cpu"
    train_loader, val_loader, classes = _loaders()
    model = build_backbone().to(device)
    opt = torch.optim.AdamW(model.parameters(), lr=CFG.food_lr)
    loss_fn = torch.nn.CrossEntropyLoss()

    mlflow.set_tracking_uri("file:mlruns")
    best_top1 = -1.0
    with mlflow.start_run(run_name="efficientnet-food101"):
        mlflow.log_params({"model": CFG.food_model_name, "lr": CFG.food_lr, "epochs": CFG.food_epochs})
        for epoch in range(CFG.food_epochs):
            model.train()
            for x, y in train_loader:
                opt.zero_grad()
                loss_fn(model(x.to(device)), y.to(device)).backward()
                opt.step()
            top1, top5 = _topk_acc(model, val_loader, device)
            mlflow.log_metrics({"val_top1": top1, "val_top5": top5}, step=epoch)
            if top1 > best_top1:
                best_top1 = top1
                export_onnx(model.to("cpu"))
                model.to(device)
    _save_classes(classes)
    return best_top1


def _save_classes(classes: list[str]) -> None:
    import json

    CFG.food_labels_path.parent.mkdir(parents=True, exist_ok=True)
    CFG.food_labels_path.write_text(json.dumps(classes))


def export_onnx(model, path=None):
    import torch

    path = str(path or CFG.food_onnx_path)
    CFG.food_onnx_path.parent.mkdir(parents=True, exist_ok=True)
    model.eval()
    dummy = torch.randn(1, 3, CFG.image_size, CFG.image_size)
    torch.onnx.export(model, dummy, path, input_names=["input"], output_names=["logits"], opset_version=17)


# Inference.
_SESSION = None
_CLASSES = None


def _load():
    global _SESSION, _CLASSES
    if _SESSION is None:
        import json

        import onnxruntime as ort

        _SESSION = ort.InferenceSession(str(CFG.food_onnx_path), providers=["CPUExecutionProvider"])
        _CLASSES = json.loads(CFG.food_labels_path.read_text())
    return _SESSION, _CLASSES


def predict(image, top_k: int = 5) -> dict:
    from PIL import Image

    session, classes = _load()
    if isinstance(image, (str, bytes)):
        image = Image.open(image)
    img = image.convert("RGB").resize((CFG.image_size, CFG.image_size))
    x = (np.asarray(img, dtype=np.float32) / 255.0).transpose(2, 0, 1)[None, :]
    logits = session.run(None, {"input": x})[0][0]
    e = np.exp(logits - logits.max())
    probs = e / e.sum()
    order = probs.argsort()[::-1][:top_k]
    return {
        "dish": classes[int(order[0])],
        "class_conf": float(probs[order[0]]),
        "top5": [{"dish": classes[int(i)], "prob": float(probs[i])} for i in order],
    }


if __name__ == "__main__":
    print({"best_val_top1": train()})
