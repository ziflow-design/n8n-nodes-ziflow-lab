import { INodeProperties } from 'n8n-workflow';

export const stageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['stage'] } },
		options: [
			{
				name: 'Set Final Status Calculation',
				value: 'setFinalStatus',
				description: 'Set how the final status is calculated for a stage',
				action: 'Set final status calculation for a stage',
				routing: {
					request: {
						method: 'PUT',
						url: '=/stages/{{$parameter["stageId"]}}/final-status',
					},
				},
			},
			{
				name: 'Start',
				value: 'start',
				description: 'Start a stage (Enterprise only)',
				action: 'Start a stage',
				routing: {
					request: {
						method: 'POST',
						url: '=/stages/{{$parameter["stageId"]}}/start',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a stage',
				action: 'Update a stage',
				routing: {
					request: {
						method: 'PUT',
						url: '=/stages/{{$parameter["stageId"]}}',
					},
				},
			},
		],
		default: 'update',
	},
];

export const stageFields: INodeProperties[] = [
	// ── Shared: Stage ID ──────────────────────────────────────────────────────
	{
		displayName: 'Stage ID',
		name: 'stageId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['stage'],
				operation: ['update', 'start', 'setFinalStatus'],
			},
		},
		description: 'The ID of the stage',
	},

	// ── Update ────────────────────────────────────────────────────────────────
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['stage'], operation: ['update'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the stage',
				routing: { send: { type: 'body', property: 'name' } },
			},
			{
				displayName: 'Due Date',
				name: 'dueDate',
				type: 'dateTime',
				default: '',
				description: 'Due date for the stage',
				routing: { send: { type: 'body', property: 'due_date' } },
			},
			{
				displayName: 'Lock on Decision',
				name: 'lockOnDecision',
				type: 'boolean',
				default: false,
				description: 'Whether to lock the stage once a decision is made',
				routing: { send: { type: 'body', property: 'lock_on_decision' } },
			},
		],
	},

	// ── Set Final Status ──────────────────────────────────────────────────────
	{
		displayName: 'Final Status Calculation',
		name: 'finalStatusCalculation',
		type: 'options',
		required: true,
		default: 'all_reviewers',
		displayOptions: { show: { resource: ['stage'], operation: ['setFinalStatus'] } },
		options: [
			{ name: 'All Reviewers Must Decide', value: 'all_reviewers' },
			{ name: 'At Least One Reviewer Must Decide', value: 'one_reviewer' },
			{ name: 'Owner Decides', value: 'owner' },
		],
		routing: { send: { type: 'body', property: 'final_status_calculation' } },
	},
];
