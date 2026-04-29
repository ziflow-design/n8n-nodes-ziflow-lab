# n8n-nodes-ziflow-lab

# This node is experimental

[n8n](https://n8n.io) community nodes for the [Ziflow](https://ziflow.com) creative review and proofing platform. Automate proof creation, reviewer management, and workflow orchestration directly inside n8n.

## Nodes

### Ziflow

An action node for interacting with the Ziflow REST API. Supports eight resources:

| Resource | Operations |
|---|---|
| **Proof** | Create, Get, List, Update, Delete |
| **Comment** | Create, Get, List |
| **Folder** | Create, Get, List, Update, Delete |
| **Reviewer** | Add, Get, Update, Delete |
| **Stage** | Update |
| **User** | Create, Get, List, Update, Delete |
| **Webhook** | Create, List, Delete |
| **Workflow Template** | Create, Get, List, Update, Delete |

### Ziflow Trigger

A webhook trigger node that starts an n8n workflow when Ziflow proof events occur. On activation it automatically registers a webhook with Ziflow and validates incoming requests using HMAC-SHA256 signature verification. On deactivation it removes the webhook from Ziflow.

Supported events:

- All Events
- Comment / Comment Reaction
- Complete Review
- Created / Deleted / Restored
- Decision
- First Opened
- Mentions
- Processed
- Shared
- Stage Deadline Passed / Stage Locked / Stage Started
- Status Change
- Summary

## Authentication

Both nodes use the **Ziflow API** credential type, which authenticates with a single API key sent as the `apikey` header. You can find or generate your API key in your Ziflow account settings.

## Local Development Setup

### Prerequisites

- **Node.js v22+** — install via [nvm](https://github.com/nvm-sh/nvm) (recommended) or from [nodejs.org](https://nodejs.org)
- **npm** (bundled with Node.js)
- **git**

### Steps

1. **Clone the repo**

   ```bash
   git clone https://github.com/ziflow-design/ziflow-n8n-lab.git
   cd n8n-nodes-ziflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This installs all dev dependencies including `@n8n/node-cli`, which bundles n8n for local development — no separate n8n installation needed.

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   This builds the TypeScript, starts a local n8n instance with the Ziflow nodes loaded, and watches for file changes. n8n opens at [http://localhost:5678](http://localhost:5678).

4. **Add your credentials in n8n**

   In the local n8n UI, create a **Ziflow API** credential and paste your Ziflow API key. The credential is verified automatically against `GET /v1/users`.

5. **Build your workflows**

   Add the **Ziflow** or **Ziflow Trigger** node to a workflow and start testing.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start n8n with nodes loaded and watch for changes |
| `npm run build` | Compile TypeScript to `dist/` for production |
| `npm run build:watch` | Compile in watch mode (no n8n instance) |
| `npm run lint` | Check for errors and style issues |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run release` | Bump version, update changelog, tag, and push |

### Testing the Ziflow Trigger locally

The **Ziflow Trigger** node registers a webhook with Ziflow when a workflow is activated or test-run. Ziflow requires the webhook URL to be a publicly reachable HTTPS endpoint — `localhost` URLs are rejected.

Use [ngrok](https://ngrok.com) to expose your local n8n instance:

1. **Install ngrok** — follow the [ngrok quickstart](https://ngrok.com/docs/getting-started/) and authenticate with your account.

2. **Start ngrok** in a separate terminal, pointing at n8n's default port:

   ```bash
   ngrok http 5678
   ```

   ngrok will print a public URL like `https://your-subdomain.ngrok-free.app`.

3. **Set `WEBHOOK_URL` in your `.env` file** to the ngrok URL:

   ```
   WEBHOOK_URL=https://your-subdomain.ngrok-free.app
   ```

   The `npm run dev` script loads `.env` automatically. This tells n8n to use the ngrok URL when registering webhooks with Ziflow instead of `localhost`.

4. Open n8n at `https://your-subdomain.ngrok-free.app` (not `localhost`) to avoid browser/cookie issues, then test your Ziflow Trigger workflow as normal.

> **Note:** Free ngrok accounts get a different URL each session. Re-start n8n with the new `WEBHOOK_URL` value each time ngrok restarts.

### Troubleshooting

**Node doesn't appear in n8n**
- Confirm it's listed in `package.json` under `n8n.nodes`
- Restart the dev server with `npm run dev`
- Check the terminal for TypeScript or build errors

**TypeScript errors**
- Ensure you're on Node.js v22 or higher
- Run `npm install` to make sure all type definitions are present

**Ziflow Trigger returns 422 on activation**
- Ziflow requires a public HTTPS webhook URL — see [Testing the Ziflow Trigger locally](#testing-the-ziflow-trigger-locally) above
- Check that `WEBHOOK_URL` is set to your current ngrok URL before starting n8n

## Resources

- [Ziflow API Documentation](https://docs.ziflow.com/en/api-documentation)
- [n8n Node Development Guide](https://docs.n8n.io/integrations/creating-nodes/)
- [@n8n/node-cli Documentation](https://www.npmjs.com/package/@n8n/node-cli)

## License

[MIT](LICENSE.md)
