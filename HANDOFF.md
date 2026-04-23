# Ziflow n8n Nodes — Session Handoff

## What We're Building

A community n8n node package (`n8n-nodes-ziflow`) that integrates Ziflow's creative review and proofing platform into n8n workflows. Two nodes total:

1. **`Ziflow`** — Action node (declarative style): covers all REST operations via Resource + Operation picker
2. **`ZiflowTrigger`** — Webhook trigger node (programmatic style): registers/deregisters Ziflow webhooks and fires workflows on proof events

Package will be published to npm and submitted to the n8n community nodes registry.

---

## Current State

### Done
- [x] Cloned `n8n-nodes-starter`, removed example nodes (Example, GithubIssues) and GitHub credentials
- [x] `package.json` updated for `n8n-nodes-ziflow` (name, description, author, n8n field with correct dist paths)
- [x] `node_modules` installed, `npm run build` verified working
- [x] `.nvmrc` set to `22.22.0` — **Node 22 is required** (`@n8n/node-cli` pulls in `isolated-vm` which needs Node ≥22)
- [x] First commit on `main` (commit `b5d438c`)
- [x] Empty folders created: `nodes/Ziflow/descriptions/`, `nodes/ZiflowTrigger/`, `credentials/`

### Not Started
- [ ] `credentials/ZiflowApi.credentials.ts`
- [ ] `nodes/Ziflow/Ziflow.node.ts` (action node shell)
- [ ] `nodes/Ziflow/descriptions/ProofDescription.ts`
- [ ] `nodes/Ziflow/descriptions/StageDescription.ts`
- [ ] `nodes/Ziflow/descriptions/ReviewerDescription.ts`
- [ ] `nodes/Ziflow/descriptions/CommentDescription.ts`
- [ ] `nodes/Ziflow/descriptions/FolderDescription.ts`
- [ ] `nodes/Ziflow/descriptions/WorkflowTemplateDescription.ts`
- [ ] `nodes/Ziflow/descriptions/UserDescription.ts`
- [ ] `nodes/Ziflow/descriptions/WebhookDescription.ts`
- [ ] `nodes/ZiflowTrigger/ZiflowTrigger.node.ts`
- [ ] SVG icons for both nodes (placeholder or real Ziflow logo)

---

## Key Decisions & Constraints

### Authentication
- Auth method: **`apikey` header** (Ziflow's recommended method, confirmed via curl example)
- Header name: `apikey`
- Test endpoint: `GET /users?count=1`
- Credential file: `ZiflowApi.credentials.ts` — single `apiKey` password field, injected as `headers["apikey"]`
- No OAuth2 needed

### API Base URL
`https://api.ziflow.io/v1`

### Action Node — Resource/Operation Map

| Resource | Operations |
|---|---|
| **Proof** | List, Get, Create, Update, Delete, Search, Make Decision, Get Proof URL, Export Summary PDF, Export Comments PDF |
| **Stage** | Update, Start (Enterprise only), Set Final Status Calculation |
| **Reviewer** | Add, Get, Update, Delete |
| **Comment** | List, Get, Create, Resolve, Label |
| **Folder** | List, Get, Create, Update, Delete |
| **Workflow Template** | List, Get, Create, Update, Delete |
| **User** | List, Get, Create, Update, Delete |
| **Webhook** | List, Create, Delete |

Skip: SCIM endpoints (enterprise identity mgmt, not workflow-relevant), deprecated `decision-checklist/*` endpoints (use `decision-reasons/*` instead), experimental activity/emails endpoints (can add later).

### Pagination
All list operations use `count` (max 100) + `page` (1-indexed) query params. Use n8n's `IExecutePaginationFunctions` pattern.

### Trigger Node — Confirmed Webhook API

**Register on activate:**
```
POST https://api.ziflow.io/v1/webhooks
{
  "name": "n8n - {workflow_name}",
  "target": "{n8n_webhook_url}",
  "active": true,
  "generate_signature_key": true,
  "subscription_types": {
    "proof": {
      "created": true,   // only the events the user selected
      "decision": true
    }
  }
}
```

**Deregister on deactivate:**
```
DELETE https://api.ziflow.io/v1/webhooks/{subscription_id}
```

**Static data to persist:** `subscription_id` + `signature_key` (both returned from POST /webhooks response)

**Signature verification:** Ziflow sends `x-ziflow-signature` header. When `generate_signature_key: true`, Ziflow returns the key. Store it and verify incoming requests using HMAC-SHA256.

### Trigger Node — Full Event List (subscription_types.proof booleans)

```
all, created, processed, changed, deleted, restored, status_change,
comment_reaction, comment, decision, mentions, complete_review,
first_opened, summary, stage_started, stage_locked, shared, stage_deadline_passed
```

UI: offer "All Events" shortcut (`all: true`) or individual event multi-select.

One subscription per trigger node instance. No client-side filtering needed — Ziflow only sends selected events.

### Node Style
- Action node: **declarative** style (`INodeType` with `routing` in description)
- Trigger node: **programmatic** style (needs `activate()`/`deactivate()` lifecycle hooks)

### Build Order
1. Credential file (next step)
2. Action node shell + Proof resource
3. Trigger node (register/deregister + HMAC verification)
4. Remaining action node resources (Stage, Reviewer, Comment, Folder, Workflow Template, User, Webhook)
5. Pagination on all List operations
6. PDF export async handling
7. Local testing with `npm run dev` against live n8n instance
8. Publish to npm + n8n community registry

---

## Exact Next Step

**Start here in the next session:**

Build `credentials/ZiflowApi.credentials.ts`:

```typescript
// Structure to implement:
// - name: 'ziflowApi'
// - displayName: 'Ziflow API'
// - documentationUrl: 'https://docs.ziflow.com/en/api-documentation'
// - properties: [{ displayName: 'API Key', name: 'apiKey', type: 'string', typeOptions: { password: true } }]
// - authenticate: { type: 'generic', properties: { headers: { apikey: '={{$credentials.apiKey}}' } } }
// - test: { request: { baseURL: 'https://api.ziflow.io/v1', url: '/users', qs: { count: 1 } } }
```

Then immediately wire up the action node shell in `nodes/Ziflow/Ziflow.node.ts` with the Proof resource as the first working resource, following the GithubIssues declarative style pattern from the starter (even though we deleted those files, the pattern is: spread resource descriptions into the properties array, use `routing.request` in each operation).

Reference the starter's GitHub Issues node pattern from:
https://raw.githubusercontent.com/n8n-io/n8n-nodes-starter/master/nodes/GithubIssues/GithubIssues.node.ts

---

## Dev Environment Notes

- **Node version:** Must use Node 22 — run `nvm use 22.22.0` before any npm commands
- **Working directory:** `/Users/johnstetic/ziflow-tools/ziflow-n8n-lab`
- **Build:** `npm run build`
- **Dev (hot reload):** `npm run dev` (requires local n8n instance)
- **Lint:** `npm run lint`
