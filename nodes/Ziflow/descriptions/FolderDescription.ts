import { INodeProperties } from 'n8n-workflow';

export const folderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['folder'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new folder',
				action: 'Create a folder',
				routing: { request: { method: 'POST', url: '/folders' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a folder',
				action: 'Delete a folder',
				routing: { request: { method: 'DELETE', url: '=/folders/{{$parameter["folderId"]}}' } },
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a folder by ID',
				action: 'Get a folder',
				routing: { request: { method: 'GET', url: '=/folders/{{$parameter["folderId"]}}' } },
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all folders',
				action: 'List folders',
				routing: { request: { method: 'GET', url: '/folders' } },
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a folder',
				action: 'Update a folder',
				routing: { request: { method: 'PUT', url: '=/folders/{{$parameter["folderId"]}}' } },
			},
		],
		default: 'list',
	},
];

export const folderFields: INodeProperties[] = [
	// ── Shared: Folder ID ─────────────────────────────────────────────────────
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the folder',
	},

	// ── List ──────────────────────────────────────────────────────────────────
	{
		displayName: 'Count',
		name: 'count',
		type: 'number',
		default: 20,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['folder'], operation: ['list'] } },
		description: 'Number of results to return (max 100)',
		routing: { send: { type: 'query', property: 'count' } },
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { resource: ['folder'], operation: ['list'] } },
		description: 'Page number (1-indexed)',
		routing: { send: { type: 'query', property: 'page' } },
	},

	// ── Create ────────────────────────────────────────────────────────────────
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['folder'], operation: ['create'] } },
		description: 'Name of the folder',
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['folder'], operation: ['create'] } },
		options: [
			{
				displayName: 'Parent Folder ID',
				name: 'parentFolderId',
				type: 'string',
				default: '',
				description: 'ID of the parent folder (leave empty for root)',
				routing: { send: { type: 'body', property: 'parent_folder_id' } },
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
		displayOptions: { show: { resource: ['folder'], operation: ['update'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the folder',
				routing: { send: { type: 'body', property: 'name' } },
			},
			{
				displayName: 'Parent Folder ID',
				name: 'parentFolderId',
				type: 'string',
				default: '',
				description: 'ID of the new parent folder',
				routing: { send: { type: 'body', property: 'parent_folder_id' } },
			},
		],
	},
];
