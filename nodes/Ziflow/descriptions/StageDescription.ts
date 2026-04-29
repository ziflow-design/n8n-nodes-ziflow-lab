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
						url: '=/proofs/{{$parameter["proofId"]}}/stages/{{$parameter["stageId"]}}/final-status-calculation',
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
						method: 'PUT',
						url: '=/proofs/{{$parameter["proofId"]}}/stages/{{$parameter["stageId"]}}/start',
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
						url: '=/proofs/{{$parameter["proofId"]}}/stages/{{$parameter["stageId"]}}',
					},
				},
			},
		],
		default: 'update',
	},
];

export const stageFields: INodeProperties[] = [
	// ── Shared: Proof ID ──────────────────────────────────────────────────────
	{
		displayName: 'Proof ID',
		name: 'proofId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['stage'],
				operation: ['update', 'start', 'setFinalStatus'],
			},
		},
		description: 'The ID of the proof that owns this stage',
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
				resource: ['stage'],
				operation: ['update', 'start', 'setFinalStatus'],
			},
		},
		description: 'The ID of the stage',
		// Send stageId as body "id" to satisfy PutStage required field
		routing: { send: { type: 'body', property: 'id' } },
	},

	// ── Update: Members (required by PutStage spec) ───────────────────────────
	{
		displayName: 'Members',
		name: 'members',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		required: true,
		default: {},
		displayOptions: { show: { resource: ['stage'], operation: ['update'] } },
		description: 'Reviewers for the stage. Members not included will be removed from the stage.',
		placeholder: 'Add Member',
		options: [
			{
				name: 'member',
				displayName: 'Member',
				values: [
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						description: 'Email address of the reviewer',
					},
					{
						displayName: 'Member ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'ID of an existing reviewer (include to keep them; omit to remove)',
					},
					{
						displayName: 'Can Comment',
						name: 'comment',
						type: 'boolean',
						default: true,
						description: 'Whether the reviewer can leave comments',
					},
					{
						displayName: 'Can Decide',
						name: 'decision',
						type: 'boolean',
						default: false,
						description: 'Whether the reviewer can make approval decisions',
					},
					{
						displayName: 'Can Manage',
						name: 'manage',
						type: 'boolean',
						default: false,
						description: 'Whether the reviewer has manage permissions',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'members',
				value: '={{$value.member}}',
			},
		},
	},

	// ── Update: Optional Fields ───────────────────────────────────────────────
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
				routing: { send: { type: 'body', property: 'deadline' } },
			},
			{
				displayName: 'Final Status Calculation',
				name: 'finalStatusCalculation',
				type: 'options',
				default: 'all_reviewers',
				description: 'How the final status of the stage is calculated',
				options: [
					{ name: 'All Reviewers Must Decide', value: 'all_reviewers' },
					{ name: 'At Least One Reviewer Must Decide', value: 'one_reviewer' },
					{ name: 'Owner Decides', value: 'owner' },
				],
				routing: { send: { type: 'body', property: 'final_status_calculation' } },
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
