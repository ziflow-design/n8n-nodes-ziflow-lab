import { INodeProperties } from 'n8n-workflow';

export const proofOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['proof'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new proof',
				action: 'Create a proof',
				routing: { request: { method: 'POST', url: '/proofs' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a proof',
				action: 'Delete a proof',
				routing: { request: { method: 'DELETE', url: '=/proofs/{{$parameter["proofId"]}}' } },
			},
			{
				name: 'Export Comments PDF',
				value: 'exportCommentsPdf',
				description: 'Export a PDF of all comments on a proof',
				action: 'Export comments PDF for a proof',
				routing: {
					request: { method: 'POST', url: '=/proofs/{{$parameter["proofId"]}}/export/comment' },
				},
			},
			{
				name: 'Export Summary PDF',
				value: 'exportSummaryPdf',
				description: 'Export a summary PDF for a proof',
				action: 'Export summary PDF for a proof',
				routing: {
					request: { method: 'POST', url: '=/proofs/{{$parameter["proofId"]}}/export/summary' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a proof by ID',
				action: 'Get a proof',
				routing: { request: { method: 'GET', url: '=/proofs/{{$parameter["proofId"]}}' } },
			},
			{
				name: 'Get Proof URL',
				value: 'getProofUrl',
				description: 'Get the viewer URL for a proof',
				action: 'Get proof URL',
				routing: { request: { method: 'GET', url: '=/proofs/{{$parameter["proofId"]}}/proof-url' } },
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all proofs',
				action: 'List proofs',
				routing: { request: { method: 'GET', url: '/proofs' } },
			},
			{
				name: 'Make Decision',
				value: 'makeDecision',
				description: 'Submit a review decision on a proof',
				action: 'Make a decision on a proof',
				routing: { request: { method: 'POST', url: '=/proofs/{{$parameter["proofId"]}}/decision' } },
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search for proofs',
				action: 'Search proofs',
				routing: { request: { method: 'GET', url: '/proofs' } },
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a proof',
				action: 'Update a proof',
				routing: { request: { method: 'PUT', url: '=/proofs/{{$parameter["proofId"]}}' } },
			},
		],
		default: 'list',
	},
];

export const proofFields: INodeProperties[] = [
	// ── Shared: Proof ID ──────────────────────────────────────────────────────
	{
		displayName: 'Proof ID',
		name: 'proofId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['proof'],
				operation: ['get', 'update', 'delete', 'makeDecision', 'getProofUrl', 'exportSummaryPdf', 'exportCommentsPdf'],
			},
		},
		description: 'The ID of the proof',
	},

	// ── List / Search ─────────────────────────────────────────────────────────
	{
		displayName: 'Count',
		name: 'count',
		type: 'number',
		default: 20,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['proof'], operation: ['list', 'search'] } },
		description: 'Number of results to return (max 100)',
		routing: { send: { type: 'query', property: 'count' } },
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { resource: ['proof'], operation: ['list', 'search'] } },
		description: 'Page number (1-indexed)',
		routing: { send: { type: 'query', property: 'page' } },
	},
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['proof'], operation: ['search'] } },
		description: 'Text to search for in proof names',
		routing: { send: { type: 'query', property: 'query' } },
	},

	// ── Create ────────────────────────────────────────────────────────────────
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['proof'], operation: ['create'] } },
		description: 'Name of the proof',
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['proof'], operation: ['create'] } },
		options: [
			{
				displayName: 'Folder ID',
				name: 'folderId',
				type: 'string',
				default: '',
				description: 'ID of the folder to place the proof in',
				routing: { send: { type: 'body', property: 'folder_id' } },
			},
			{
				displayName: 'Workflow Template ID',
				name: 'workflowTemplateId',
				type: 'string',
				default: '',
				description: 'ID of the workflow template to apply',
				routing: { send: { type: 'body', property: 'workflow_template_id' } },
			},
			{
				displayName: 'Due Date',
				name: 'dueDate',
				type: 'dateTime',
				default: '',
				description: 'Due date for the proof',
				routing: { send: { type: 'body', property: 'due_date' } },
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
		displayOptions: { show: { resource: ['proof'], operation: ['update'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the proof',
				routing: { send: { type: 'body', property: 'name' } },
			},
			{
				displayName: 'Due Date',
				name: 'dueDate',
				type: 'dateTime',
				default: '',
				description: 'New due date for the proof',
				routing: { send: { type: 'body', property: 'due_date' } },
			},
			{
				displayName: 'Folder ID',
				name: 'folderId',
				type: 'string',
				default: '',
				description: 'ID of the folder to move the proof to',
				routing: { send: { type: 'body', property: 'folder_id' } },
			},
		],
	},

	// ── Make Decision ─────────────────────────────────────────────────────────
	{
		displayName: 'Decision',
		name: 'decision',
		type: 'options',
		required: true,
		default: 'approved',
		displayOptions: { show: { resource: ['proof'], operation: ['makeDecision'] } },
		options: [
			{ name: 'Approved', value: 'approved' },
			{ name: 'Approved with Changes', value: 'approved_with_changes' },
			{ name: 'Changes Required', value: 'changes_required' },
		],
		routing: { send: { type: 'body', property: 'decision' } },
	},
	{
		displayName: 'Decision Reason',
		name: 'decisionReason',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['proof'], operation: ['makeDecision'] } },
		description: 'Optional reason or comment for the decision',
		routing: { send: { type: 'body', property: 'reason' } },
	},
];
