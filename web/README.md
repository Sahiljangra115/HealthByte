# HealthByte Web

Two frontends for the HealthByte engine.

## app

The interactive client: a multi-screen React app (Home, Log, Plan, Scan, Profile) built with Vite and TypeScript. Scan a meal, log biometrics, and view personalized insights served by the Python API in the repo root.

```bash
cd web/app
npm install
cp .env.example .env        # set GEMINI_API_KEY and APP_URL
npm run dev                 # http://localhost:3000
npm run build
```

## v0-website

The marketing landing page: a Next.js site with shadcn/ui components, covering the hero, how-it-works, the nutrition engine, and the fusion layer.

```bash
cd web/v0-website
pnpm install
pnpm dev
pnpm build
```

Both are independent Node projects; install inside each folder. `node_modules`, build output, and `.env` are gitignored.
