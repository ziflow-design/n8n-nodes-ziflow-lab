import { INodeProperties } from 'n8n-workflow';

export const reviewerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['reviewer'] } },
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Add a reviewer to a proof stage',
				action: 'Add a reviewer',
				routing: {
					request: {
						method: 'POST',
						url: '=/proofs/{{$parameter["proofId"]}}/stages/{{$parameter["stageId"]}}/reviewers',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove a reviewer from a proof stage',
				action: 'Delete a reviewer',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/proofs/{{$parameter["proofId"]}}/stages/{{$parameter["stageId"]}}/reviewers/{{$parameter["reviewerId"]}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a reviewer from a proof stage',
				action: 'Get a reviewer',
				routing: {
					request: {
						method: 'GET',
						url: '=/proofs/{{$parameter["proofId"]}}/stages/{{$parameter["stageId"]}}/reviewers/{{$parameter["reviewerId"]}}',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a reviewer on a proof stage',
				action: 'Update a reviewer',
				routing: {
					request: {
						method: 'PUT',
						url: '=/proofs/{{$parameter["proofId"]}}/stages/{{$parameter["stageId"]}}/reviewers/{{$parameter["reviewerId"]}}',
					},
				},
			},
		],
		default: 'add',
	},
];

export const reviewerFields: INodeProperties[] = [
	// ── Shared: Proof ID ──────────────────────────────────────────────────────
	{
		displayName: 'Proof ID',
		name: 'proofId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['reviewer'],
				operation: ['add', 'get', 'update', 'delete'],
			},
		},
		description: 'The ID of the proof',
	},

	// ── Shared: Stage ID ──────────────────────────────────────────────────────
	{
		displayName: 'Stage ID',
		name: 'stageId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['reviewer'],
				operation: ['add', 'get', 'update', 'delete'],
			},
		},
		description: 'The ID of the stage',
	},

	// ── Shared: Reviewer ID ───────────────────────────────────────────────────
	{
		displayName: 'Reviewer ID',
		name: 'reviewerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['reviewer'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the reviewer',
	},

	// ── Add ───────────────────────────────────────────────────────────────────
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['reviewer'], operation: ['add'] } },
		description: 'Email address of the reviewer to add',
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['reviewer'], operation: ['add'] } },
		options: [
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				default: 'reviewer',
				options: [
					{ name: 'Reviewer', value: 'reviewer' },
					{ name: 'Owner', value: 'owner' },
				],
				routing: { send: { type: 'body', property: 'role' } },
			},
			{
				displayName: 'Can Download',
				name: 'canDownload',
				type: 'boolean',
				default: true,
				routing: { send: { type: 'body', property: 'can_download' } },
			},
			{
				displayName: 'Can Make Decisions',
				name: 'canMakeDecisions',
				type: 'boolean',
				default: true,
				routing: { send: { type: 'body', property: 'can_make_decisions' } },
			},
		],
	},

	// ── Update ────────────────────────────────────────────────────────────────
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['reviewer'], operation: ['update'] } },
		options: [
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				default: 'reviewer',
				options: [
					{ name: 'Reviewer', value: 'reviewer' },
					{ name: 'Owner', value: 'owner' },
				],
				routing: { send: { type: 'body', property: 'role' } },
			},
			{
				displayName: 'Can Download',
				name: 'canDownload',
				type: 'boolean',
				default: true,
				routing: { send: { type: 'body', property: 'can_download' } },
			},
			{
				displayName: 'Can Make Decisions',
				name: 'canMakeDecisions',
				type: 'boolean',
				default: true,
				routing: { send: { type: 'body', property: 'can_make_decisions' } },
			},
		],
	},
];
