import { INodeProperties } from 'n8n-workflow';

export const commentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['comment'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a comment on a proof',
				action: 'Create a comment',
				routing: {
					request: {
						method: 'POST',
						url: '=/proofs/{{$parameter["proofId"]}}/comments',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a comment by ID',
				action: 'Get a comment',
				routing: {
					request: {
						method: 'GET',
						url: '=/proofs/{{$parameter["proofId"]}}/comments/{{$parameter["commentId"]}}',
					},
				},
			},
			{
				name: 'Label',
				value: 'label',
				description: 'Add a label to a comment',
				action: 'Label a comment',
				routing: {
					request: {
						method: 'POST',
						url: '=/proofs/{{$parameter["proofId"]}}/comments/{{$parameter["commentId"]}}/label',
					},
				},
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all comments on a proof',
				action: 'List comments',
				routing: {
					request: {
						method: 'GET',
						url: '=/proofs/{{$parameter["proofId"]}}/comments',
					},
				},
			},
			{
				name: 'Resolve',
				value: 'resolve',
				description: 'Mark a comment as resolved',
				action: 'Resolve a comment',
				routing: {
					request: {
						method: 'POST',
						url: '=/proofs/{{$parameter["proofId"]}}/comments/{{$parameter["commentId"]}}/resolve',
					},
				},
			},
		],
		default: 'list',
	},
];

export const commentFields: INodeProperties[] = [
	// ── Shared: Proof ID ──────────────────────────────────────────────────────
	{
		displayName: 'Proof ID',
		name: 'proofId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['list', 'get', 'create', 'resolve', 'label'],
			},
		},
		description: 'The ID of the proof',
	},

	// ── Shared: Comment ID ────────────────────────────────────────────────────
	{
		displayName: 'Comment ID',
		name: 'commentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['get', 'resolve', 'label'],
			},
		},
		description: 'The ID of the comment',
	},

	// ── List ──────────────────────────────────────────────────────────────────
	{
		displayName: 'Count',
		name: 'count',
		type: 'number',
		default: 20,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['comment'], operation: ['list'] } },
		description: 'Number of results to return (max 100)',
		routing: { send: { type: 'query', property: 'count' } },
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { resource: ['comment'], operation: ['list'] } },
		description: 'Page number (1-indexed)',
		routing: { send: { type: 'query', property: 'page' } },
	},

	// ── Create ────────────────────────────────────────────────────────────────
	{
		displayName: 'Comment Text',
		name: 'comment',
		type: 'string',
		required: true,
		default: '',
		typeOptions: { rows: 3 },
		displayOptions: { show: { resource: ['comment'], operation: ['create'] } },
		description: 'The text content of the comment',
		routing: { send: { type: 'body', property: 'comment' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['comment'], operation: ['create'] } },
		options: [
			{
				displayName: 'Page Number',
				name: 'page',
				type: 'number',
				default: 1,
				description: 'Page/frame number to attach the comment to',
				routing: { send: { type: 'body', property: 'page' } },
			},
		],
	},

	// ── Label ─────────────────────────────────────────────────────────────────
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['comment'], operation: ['label'] } },
		description: 'Label text to apply to the comment',
		routing: { send: { type: 'body', property: 'label' } },
	},
];
