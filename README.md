# ModelPulse

ModelPulse is a static directory of 18 AI model releases from nine developers, with an explorer, release timeline, developer profiles and a comparison matrix. The catalog was migrated from the original Model Pulse directory and reviewed on November 26, 2026.

## Run locally

Run these commands from this directory with a current Node.js 24 release.

```sh
npm ci
npm run check
npm run build
npm run preview
```

Use `npm run dev` while editing. The build generates `dist/`, which can be served by a static host with directory-index handling.

## Deploy on Vercel

Import the repository, set the project Root Directory to `astro-directory`, and select Node.js 24.x. For a standalone copy of this directory, use the repository root. Vercel reads the framework, build command, output directory and response headers from `vercel.json`.

Add the custom hostname in Vercel and configure its DNS records in Cloudflare using the values Vercel provides. If proxying the hostname through Cloudflare, use end-to-end HTTPS with Full (strict) and keep script injection and HTML rewriting features such as Rocket Loader disabled for this hostname. The Content Security Policy permits same-origin scripts and stylesheets. Allow Vercel domain verification and certificate renewal through the proxy, then check the headers at the public hostname. See the [Vercel proxy configuration guide](https://vercel.com/kb/guide/can-i-use-a-proxy-on-top-of-my-vercel-deployment).

## Maintain the catalog

Add one JSON file per developer or model under `src/content/developers/` or `src/content/models/`. Keep the filename and `id` identical, use a lowercase kebab-case slug, and cite an official announcement, changelog or model card. Release dates use the provider's announcement date in YYYY-MM-DD format. Keep access channels and licensing current, and omit the optional context window when the provider has not documented it.

Astro discovers `src/content.config.ts`, which exports the schemas from `src/content/config.ts`. Zod validates the record fields. The catalog loader checks that entry IDs match their filenames and that all model references resolve before pages are generated.

## Share filtered views

- Explorer uses `q`, `developer`, `capability`, `availability`, `license` and `view=cards`.
- Timeline uses `developer` and `capability`.
- Repeat a query key to select multiple options in a filter. Options within a filter match any selection, and filters combine across groups.
- Comparison accepts a comma-separated list of model IDs, such as `/compare/?models=llama-4-scout,mistral-large-4`. A one-model link preselects that model for further comparison.

