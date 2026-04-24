import { INodeType, INodeTypeDescription, NodeConnectionTypes } from 'n8n-workflow';

import { commentFields, commentOperations } from './descriptions/CommentDescription';
import { folderFields, folderOperations } from './descriptions/FolderDescription';
import { proofFields, proofOperations } from './descriptions/ProofDescription';
import { reviewerFields, reviewerOperations } from './descriptions/ReviewerDescription';
import { stageFields, stageOperations } from './descriptions/StageDescription';
import { userFields, userOperations } from './descriptions/UserDescription';
import { webhookFields, webhookOperations } from './descriptions/WebhookDescription';
import {
	workflowTemplateFields,
	workflowTemplateOperations,
} from './descriptions/WorkflowTemplateDescription';

export class Ziflow implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ziflow',
		name: 'ziflow',
		icon: 'file:ziflow.svg',
		usableAsTool: true,
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Ziflow creative review and proofing platform',
		defaults: { name: 'Ziflow' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'ziflowApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.ziflow.io/v1',
			headers: {
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Comment', value: 'comment' },
					{ name: 'Folder', value: 'folder' },
					{ name: 'Proof', value: 'proof' },
					{ name: 'Reviewer', value: 'reviewer' },
					{ name: 'Stage', value: 'stage' },
					{ name: 'User', value: 'user' },
					{ name: 'Webhook', value: 'webhook' },
					{ name: 'Workflow Template', value: 'workflowTemplate' },
				],
				default: 'proof',
			},

			// Resource operations
			...commentOperations,
			...folderOperations,
			...proofOperations,
			...reviewerOperations,
			...stageOperations,
			...userOperations,
			...webhookOperations,
			...workflowTemplateOperations,

			// Resource fields
			...commentFields,
			...folderFields,
			...proofFields,
			...reviewerFields,
			...stageFields,
			...userFields,
			...webhookFields,
			...workflowTemplateFields,
		],
	};
}
