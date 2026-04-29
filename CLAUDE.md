# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **n8n-nodes-ziflow-lab**, an n8n community node package integrating the [Ziflow](https://ziflow.com) creative review platform. It provides two nodes:

- **Ziflow** — declarative action node (8 resources, 30+ operations) for Ziflow REST API
- **ZiflowTrigger** — programmatic webhook trigger node with automatic register/deregister lifecycle and HMAC-SHA256 signature verification

## Node.js Requirement

**Node 22 is required.** The `@n8n/node-cli` dependency uses `isolated-vm` which requires Node ≥ 22.

```bash
nvm use 22.22.0
```

## Commands

```bash
npm install          # Install dependencies (no separate n8n install needed)
npm run dev          # Build, start local n8n at localhost:5678, watch for changes
npm run build        # Compile TypeScript → dist/
npm run lint         # Check for errors and style issues
npm run lint:fix     # Auto-fix linting
npm run release      # Bump version, update CHANGELOG, tag, and push
```

There is no automated test suite — `npm test` runs lint. Testing is done manually via the local n8n UI after `npm run dev`.

## Local Webhook Testing (ngrok)

The ZiflowTrigger node requires an externally reachable URL. Use ngrok for local testing:

```bash
# Terminal 1
ngrok http 5678

# .env (copy from .env.sample)
WEBHOOK_URL=https://your-subdomain.ngrok-free.app

# Terminal 2
npm run dev
```

Use the ngrok URL in the browser (not localhost) to avoid cookie issues. The dev script loads `.env` via `--env-file-if-exists`.

## Architecture

### Credential

[credentials/ZiflowApi.credentials.ts](credentials/ZiflowApi.credentials.ts) — API key sent as `apikey` header. Test endpoint: `GET /users?count=1`.

### Action Node

[nodes/Ziflow/Ziflow.node.ts](nodes/Ziflow/Ziflow.node.ts) is a thin shell (~85 lines). All resource logic lives in [nodes/Ziflow/descriptions/](nodes/Ziflow/descriptions/), one file per resource:

- Each description file exports `{Resource}Operations` (the operation dropdown) and `{Resource}Fields` (parameter definitions)
- Operations use declarative routing: fields carry `routing.request` with `method` and `url`
- Base URL: `https://api.ziflow.io/v1`, default header: `Content-Type: application/json`

### Trigger Node

[nodes/ZiflowTrigger/ZiflowTrigger.node.ts](nodes/ZiflowTrigger/ZiflowTrigger.node.ts) is programmatic (not declarative). Key lifecycle:

1. **Activate** → `checkExists()` looks for stored `subscriptionId` in static data, `create()` POSTs to `/webhooks` and stores `subscriptionId` + `signatureKey`
2. **Incoming request** → HMAC-SHA256 validates `X-Ziflow-Signature` using `signatureKey`
3. **Deactivate** → `delete()` DELETEs the webhook and clears static data

### Adding a New Operation

1. Open the relevant `descriptions/{Resource}Description.ts`
2. Add an entry to the `operations` array with `routing.request` (method + URL)
3. Add field definitions to the `fields` array with `displayOptions` to scope visibility
4. For new resources, create a new description file and import it in `Ziflow.node.ts`

## Key Files for Reference

- [specs/audit-findings.md](specs/audit-findings.md) — detailed Ziflow API audit (21KB), authoritative reference for endpoint paths and request/response shapes
- [specs/handoff.md](specs/handoff.md) — session handoff notes with build order and outstanding work
- [.env.sample](.env.sample) — environment variable template
