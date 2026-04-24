import { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['webhook'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new webhook subscription',
				action: 'Create a webhook',
				routing: { request: { method: 'POST', url: '/webhooks' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook subscription',
				action: 'Delete a webhook',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/webhooks/{{$parameter["webhookId"]}}',
					},
				},
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all webhook subscriptions',
				action: 'List webhooks',
				routing: { request: { method: 'GET', url: '/webhooks' } },
			},
		],
		default: 'list',
	},
];

export const webhookFields: INodeProperties[] = [
	// ── Shared: Webhook ID ────────────────────────────────────────────────────
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['delete'],
			},
		},
		description: 'The ID of the webhook subscription',
	},

	// ── Create ────────────────────────────────────────────────────────────────
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
		description: 'Name for the webhook subscription',
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Target URL',
		name: 'target',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
		description: 'The URL that will receive webhook payloads',
		routing: { send: { type: 'body', property: 'target' } },
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		required: true,
		default: ['all'],
		displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
		description: 'Proof events to subscribe to',
		options: [
			{ name: 'All Events', value: 'all' },
			{ name: 'Comment', value: 'comment' },
			{ name: 'Complete Review', value: 'complete_review' },
			{ name: 'Created', value: 'created' },
			{ name: 'Decision', value: 'decision' },
			{ name: 'Deleted', value: 'deleted' },
			{ name: 'First Opened', value: 'first_opened' },
			{ name: 'Mentions', value: 'mentions' },
			{ name: 'Processed', value: 'processed' },
			{ name: 'Restored', value: 'restored' },
			{ name: 'Shared', value: 'shared' },
			{ name: 'Stage Deadline Passed', value: 'stage_deadline_passed' },
			{ name: 'Stage Locked', value: 'stage_locked' },
			{ name: 'Stage Started', value: 'stage_started' },
			{ name: 'Status Change', value: 'status_change' },
			{ name: 'Summary', value: 'summary' },
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
		options: [
			{
				displayName: 'Active',
				name: 'active',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is active',
				routing: { send: { type: 'body', property: 'active' } },
			},
			{
				displayName: 'Generate Signature Key',
				name: 'generateSignatureKey',
				type: 'boolean',
				default: true,
				description: 'Whether Ziflow should generate an HMAC signature key for payload verification',
				routing: { send: { type: 'body', property: 'generate_signature_key' } },
			},
		],
	},
];
