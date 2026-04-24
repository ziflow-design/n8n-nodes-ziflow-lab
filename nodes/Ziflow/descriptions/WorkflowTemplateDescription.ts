import { INodeProperties } from 'n8n-workflow';

export const workflowTemplateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['workflowTemplate'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new workflow template',
				action: 'Create a workflow template',
				routing: { request: { method: 'POST', url: '/workflow-templates' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a workflow template',
				action: 'Delete a workflow template',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/workflow-templates/{{$parameter["workflowTemplateId"]}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a workflow template by ID',
				action: 'Get a workflow template',
				routing: {
					request: {
						method: 'GET',
						url: '=/workflow-templates/{{$parameter["workflowTemplateId"]}}',
					},
				},
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all workflow templates',
				action: 'List workflow templates',
				routing: { request: { method: 'GET', url: '/workflow-templates' } },
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a workflow template',
				action: 'Update a workflow template',
				routing: {
					request: {
						method: 'PUT',
						url: '=/workflow-templates/{{$parameter["workflowTemplateId"]}}',
					},
				},
			},
		],
		default: 'list',
	},
];

export const workflowTemplateFields: INodeProperties[] = [
	// ── Shared: Workflow Template ID ──────────────────────────────────────────
	{
		displayName: 'Workflow Template ID',
		name: 'workflowTemplateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflowTemplate'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the workflow template',
	},

	// ── List ──────────────────────────────────────────────────────────────────
	{
		displayName: 'Count',
		name: 'count',
		type: 'number',
		default: 20,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['workflowTemplate'], operation: ['list'] } },
		description: 'Number of results to return (max 100)',
		routing: { send: { type: 'query', property: 'count' } },
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { resource: ['workflowTemplate'], operation: ['list'] } },
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
		displayOptions: { show: { resource: ['workflowTemplate'], operation: ['create'] } },
		description: 'Name of the workflow template',
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['workflowTemplate'], operation: ['create'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the workflow template',
				routing: { send: { type: 'body', property: 'description' } },
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
		displayOptions: { show: { resource: ['workflowTemplate'], operation: ['update'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the workflow template',
				routing: { send: { type: 'body', property: 'name' } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the workflow template',
				routing: { send: { type: 'body', property: 'description' } },
			},
		],
	},
];
