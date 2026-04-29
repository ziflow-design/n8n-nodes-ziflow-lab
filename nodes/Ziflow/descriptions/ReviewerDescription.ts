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
				name: 'Make Decision',
				value: 'makeDecision',
				description: 'Make a decision or mark the review as complete for a reviewer on a proof',
				action: 'Make a decision',
				routing: {
					request: {
						method: 'POST',
						url: '=/proofs/{{$parameter["proofId"]}}/reviewers/status',
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
				operation: ['add', 'get', 'update', 'delete', 'makeDecision'],
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

	// ── Shared: Reviewer ID or Email ──────────────────────────────────────────
	{
		displayName: 'Reviewer ID or Email',
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
		description: 'The ID or email address of the reviewer',
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
				displayName: 'Comment Permission',
				name: 'comment',
				type: 'boolean',
				default: true,
				description: 'Whether the reviewer can leave comments',
				routing: { send: { type: 'body', property: 'comment' } },
			},
			{
				displayName: 'Decision Permission',
				name: 'decision',
				type: 'boolean',
				default: false,
				description: 'Whether the reviewer can make decisions (approve/reject)',
				routing: { send: { type: 'body', property: 'decision' } },
			},
			{
				displayName: 'Manage Permission',
				name: 'manage',
				type: 'boolean',
				default: false,
				description: 'Whether the reviewer can manage the proof',
				routing: { send: { type: 'body', property: 'manage' } },
			},
			{
				displayName: 'Move Reviewers',
				name: 'moveReviewers',
				type: 'boolean',
				default: false,
				description:
					'Whether to delete the reviewer from their previous stage and add them to the stage specified by Stage ID. Default permissions apply if no permissions are set.',
				routing: { send: { type: 'query', property: 'moveReviewers' } },
			},
			{
				displayName: 'Notification',
				name: 'notification',
				type: 'options',
				default: 'hourly_digest',
				description: 'Email notification frequency for this reviewer',
				options: [
					{ name: 'All Activity', value: 'all_activity' },
					{ name: 'Daily Digest', value: 'daily_digest' },
					{ name: 'Decisions', value: 'decisions' },
					{ name: 'Disabled', value: 'disabled' },
					{ name: 'Final Decision', value: 'final_decision' },
					{ name: 'Hourly Digest', value: 'hourly_digest' },
					{ name: 'Replies to My Comments', value: 'replies_to_my_comments' },
				],
				routing: { send: { type: 'body', property: 'notification' } },
			},
			{
				displayName: 'Share Permission',
				name: 'share',
				type: 'boolean',
				default: false,
				description: 'Whether the reviewer can share the proof (Enterprise only)',
				routing: { send: { type: 'body', property: 'share' } },
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
		displayOptions: { show: { resource: ['reviewer'], operation: ['makeDecision'] } },
		options: [
			{ name: 'Approved', value: 'approved' },
			{ name: 'Approved with Changes', value: 'approved_with_changes' },
			{ name: 'Changes Required', value: 'changes_required' },
			{ name: 'Not Relevant', value: 'not_relevant' },
			{ name: 'Pending', value: 'pending' },
		],
		routing: { send: { type: 'body', property: 'decision' } },
	},
	{
		displayName: 'Completed',
		name: 'completed',
		type: 'boolean',
		required: true,
		default: true,
		displayOptions: { show: { resource: ['reviewer'], operation: ['makeDecision'] } },
		description: 'Whether to mark the review as complete',
		routing: { send: { type: 'body', property: 'completed' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['reviewer'], operation: ['makeDecision'] } },
		options: [
			{
				displayName: 'Decision Checklist',
				name: 'decisionChecklist',
				type: 'json',
				default: '{}',
				description:
					'Decision checklist options as a JSON object: { "options": [{ "id": "...", "checked": true }] }',
				routing: { send: { type: 'body', property: 'decision_checklist' } },
			},
			{
				displayName: 'Reviewer ID',
				name: 'reviewerIdBody',
				type: 'string',
				default: '',
				description:
					'ID of the reviewer whose status to update. If omitted, updates the caller (the API key owner).',
				routing: { send: { type: 'body', property: 'reviewer_id' } },
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
				displayName: 'Comment Permission',
				name: 'comment',
				type: 'boolean',
				default: true,
				description:
					'Whether the reviewer can leave comments. Updated only on the stage specified by Stage ID.',
				routing: { send: { type: 'body', property: 'comment' } },
			},
			{
				displayName: 'Decision Permission',
				name: 'decision',
				type: 'boolean',
				default: false,
				description:
					'Whether the reviewer can make decisions. Updated only on the stage specified by Stage ID.',
				routing: { send: { type: 'body', property: 'decision' } },
			},
			{
				displayName: 'Manage Permission',
				name: 'manage',
				type: 'boolean',
				default: false,
				description:
					'Whether the reviewer can manage the proof. Updated on all stages the reviewer is on.',
				routing: { send: { type: 'body', property: 'manage' } },
			},
			{
				displayName: 'Notification',
				name: 'notification',
				type: 'options',
				default: 'hourly_digest',
				description: 'Email notification frequency for this reviewer',
				options: [
					{ name: 'All Activity', value: 'all_activity' },
					{ name: 'Daily Digest', value: 'daily_digest' },
					{ name: 'Decisions', value: 'decisions' },
					{ name: 'Disabled', value: 'disabled' },
					{ name: 'Final Decision', value: 'final_decision' },
					{ name: 'Hourly Digest', value: 'hourly_digest' },
					{ name: 'Replies to My Comments', value: 'replies_to_my_comments' },
				],
				routing: { send: { type: 'body', property: 'notification' } },
			},
			{
				displayName: 'Share Permission',
				name: 'share',
				type: 'boolean',
				default: false,
				description:
					'Whether the reviewer can share the proof. Updated on all stages the reviewer is on. Enterprise only.',
				routing: { send: { type: 'body', property: 'share' } },
			},
		],
	},
];
