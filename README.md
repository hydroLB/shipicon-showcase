# ShipIcon Web Showcase

An intentionally separate, synthetic-data-only web presentation of the ShipIcon desktop app.

## Isolation boundary

- This project lives beside, not inside, the ShipIcon desktop repository.
- It does not import ShipIcon source code or modify the desktop package.
- It contains no OpenAI SDK, API endpoint, environment variable, or credential input.
- Its interactions are deterministic and use only bundled synthetic data.
- The only product download link points to the complete desktop application.

If this showcase is abandoned, deleting this directory has no effect on ShipIcon.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

The production site is static in behavior: it requires no database, account, upload storage, or AI
service. The desktop application remains the only ShipIcon surface allowed to connect to OpenAI.
