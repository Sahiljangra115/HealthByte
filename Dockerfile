# Lambda-compatible image. Large artifacts (ONNX food model, population model)
# load from S3 to /tmp on cold start, so they are not baked in.
FROM public.ecr.aws/lambda/python:3.11

COPY pyproject.toml ${LAMBDA_TASK_ROOT}/
RUN pip install --no-cache-dir \
    fastapi uvicorn mangum pydantic python-multipart \
    onnxruntime pillow pandas numpy scipy statsmodels scikit-learn

COPY src/ ${LAMBDA_TASK_ROOT}/src/

CMD ["src.api.handler.handler"]
