# Security Boundary

The ShipIcon Web Showcase is a synthetic presentation surface, not an API proxy.

- Do not add OpenAI credentials or an AI request path.
- Do not accept project archives or repository uploads.
- Do not persist user input outside the current browser state.
- Keep every interactive result deterministic and generated from bundled synthetic assets.
- Link product downloads only to verified releases of the complete ShipIcon desktop application.

Report suspected vulnerabilities through the ShipIcon repository's private security advisory flow.
