import { INodeProperties } from 'n8n-workflow';

export const commentLabelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['commentLabel'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new comment label (Admin only)',
				action: 'Create a comment label',
				routing: { request: { method: 'POST', url: '/comment-labels' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a comment label (Admin only)',
				action: 'Delete a comment label',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/comment-labels/{{$parameter["labelId"]}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a comment label by ID',
				action: 'Get a comment label',
				routing: {
					request: {
						method: 'GET',
						url: '=/comment-labels/{{$parameter["labelId"]}}',
					},
				},
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all comment labels on the account',
				action: 'List comment labels',
				routing: { request: { method: 'GET', url: '/comment-labels' } },
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a comment label (Admin only)',
				action: 'Update a comment label',
				routing: {
					request: {
						method: 'PUT',
						url: '=/comment-labels/{{$parameter["labelId"]}}',
					},
				},
			},
		],
		default: 'list',
	},
];

export const commentLabelFields: INodeProperties[] = [
	// ── Shared: Label ID ──────────────────────────────────────────────────────
	{
		displayName: 'Label ID',
		name: 'labelId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['commentLabel'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the comment label',
	},

	// ── Create ────────────────────────────────────────────────────────────────
	{
		displayName: 'Label Name',
		name: 'label',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['commentLabel'], operation: ['create'] } },
		description: 'Display name for the label',
		routing: { send: { type: 'body', property: 'label' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['commentLabel'], operation: ['create'] } },
		options: [
			{
				displayName: 'Active',
				name: 'active',
				type: 'boolean',
				default: false,
				description: 'Whether the label is active',
				routing: { send: { type: 'body', property: 'active' } },
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'number',
				default: 0,
				description: 'Display order of the label',
				routing: { send: { type: 'body', property: 'order' } },
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
		displayOptions: { show: { resource: ['commentLabel'], operation: ['update'] } },
		options: [
			{
				displayName: 'Active',
				name: 'active',
				type: 'boolean',
				default: false,
				description: 'Whether the label is active',
				routing: { send: { type: 'body', property: 'active' } },
			},
			{
				displayName: 'Label Name',
				name: 'label',
				type: 'string',
				default: '',
				description: 'New display name for the label',
				routing: { send: { type: 'body', property: 'label' } },
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'number',
				default: 0,
				description: 'Display order of the label',
				routing: { send: { type: 'body', property: 'order' } },
			},
		],
	},
];
