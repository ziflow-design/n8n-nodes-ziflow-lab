import { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['user'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new user',
				action: 'Create a user',
				routing: { request: { method: 'POST', url: '/users' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a user',
				action: 'Delete a user',
				routing: { request: { method: 'DELETE', url: '=/users/{{$parameter["userId"]}}' } },
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user by ID',
				action: 'Get a user',
				routing: { request: { method: 'GET', url: '=/users/{{$parameter["userId"]}}' } },
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all users',
				action: 'List users',
				routing: { request: { method: 'GET', url: '/users' } },
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a user',
				action: 'Update a user',
				routing: { request: { method: 'PUT', url: '=/users/{{$parameter["userId"]}}' } },
			},
		],
		default: 'list',
	},
];

export const userFields: INodeProperties[] = [
	// ── Shared: User ID ───────────────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the user',
	},

	// ── List ──────────────────────────────────────────────────────────────────
	{
		displayName: 'Count',
		name: 'count',
		type: 'number',
		default: 20,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['user'], operation: ['list'] } },
		description: 'Number of results to return (max 100)',
		routing: { send: { type: 'query', property: 'count' } },
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { resource: ['user'], operation: ['list'] } },
		description: 'Page number (1-indexed)',
		routing: { send: { type: 'query', property: 'page' } },
	},

	// ── Create ────────────────────────────────────────────────────────────────
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
		description: 'Email address of the user',
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
		description: 'First name of the user',
		routing: { send: { type: 'body', property: 'first_name' } },
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
		description: 'Last name of the user',
		routing: { send: { type: 'body', property: 'last_name' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
		options: [
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				default: 'member',
				options: [
					{ name: 'Admin', value: 'admin' },
					{ name: 'Member', value: 'member' },
					{ name: 'Guest', value: 'guest' },
				],
				routing: { send: { type: 'body', property: 'role' } },
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
		displayOptions: { show: { resource: ['user'], operation: ['update'] } },
		options: [
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'first_name' } },
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'last_name' } },
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				default: 'member',
				options: [
					{ name: 'Admin', value: 'admin' },
					{ name: 'Member', value: 'member' },
					{ name: 'Guest', value: 'guest' },
				],
				routing: { send: { type: 'body', property: 'role' } },
			},
		],
	},
];
