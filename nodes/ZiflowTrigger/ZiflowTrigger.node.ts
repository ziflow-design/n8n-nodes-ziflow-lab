import {
	createHmac,
} from 'crypto';

import {
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeConnectionTypes,
} from 'n8n-workflow';

const ZIFLOW_API_BASE = 'https://api.ziflow.io/v1';

export class ZiflowTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ziflow Trigger',
		name: 'ziflowTrigger',
		icon: 'file:ziflow.svg',
		usableAsTool: true,
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when Ziflow proof events occur',
		defaults: { name: 'Ziflow Trigger' },
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'ziflowApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: ['all'],
				description: 'Proof events to listen for',
				options: [
					{ name: 'All Events', value: 'all' },
					{ name: 'Comment', value: 'comment' },
					{ name: 'Comment Reaction', value: 'comment_reaction' },
					{ name: 'Complete Review', value: 'complete_review' },
					{ name: 'Created', value: 'created' },
					{ name: 'Decision', value: 'decision' },
					{ name: 'Deleted', value: 'deleted' },
					{ name: 'First Opened', value: 'first_opened' },
					{ name: 'Mentions', value: 'mentions' },
					{ name: 'Processed', value: 'processed' },
					{ name: 'Restored', value: 'restored' },
					{ name: 'Shared', value: 'shared' },
					{ name: 'Stage Deadline Passed', value: 'stage_deadline_passed' },
					{ name: 'Stage Locked', value: 'stage_locked' },
					{ name: 'Stage Started', value: 'stage_started' },
					{ name: 'Status Change', value: 'status_change' },
					{ name: 'Summary', value: 'summary' },
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				return webhookData.subscriptionId !== undefined;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const events = this.getNodeParameter('events') as string[];
				const workflowName = this.getWorkflow().name ?? 'n8n workflow';

				const subscriptionTypes: Record<string, boolean> = {};
				for (const event of events) {
					subscriptionTypes[event] = true;
				}

				const body = {
					name: `n8n - ${workflowName}`,
					target: webhookUrl,
					active: true,
					generate_signature_key: true,
					subscription_types: {
						proof: subscriptionTypes,
					},
				};

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore IHookFunctions is in the IAllExecuteFunctions union; n8n binds helpers correctly
				const response = (await this.helpers.httpRequestWithAuthentication('ziflowApi', {
					method: 'POST',
					url: `${ZIFLOW_API_BASE}/webhooks`,
					body,
					json: true,
				})) as { id: string; signature_key: string };

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.subscriptionId = response.id;
				webhookData.signatureKey = response.signature_key;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const subscriptionId = webhookData.subscriptionId as string | undefined;
				if (!subscriptionId) return true;

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore IHookFunctions is in the IAllExecuteFunctions union; n8n binds helpers correctly
				await this.helpers.httpRequestWithAuthentication('ziflowApi', {
					method: 'DELETE',
					url: `${ZIFLOW_API_BASE}/webhooks/${subscriptionId}`,
					json: true,
				});

				delete webhookData.subscriptionId;
				delete webhookData.signatureKey;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const bodyData = this.getBodyData();

		const webhookData = this.getWorkflowStaticData('node');
		const signatureKey = webhookData.signatureKey as string | undefined;

		if (signatureKey) {
			const incomingSignature = req.headers['x-ziflow-signature'] as string | undefined;
			if (!incomingSignature) {
				return { noWebhookResponse: true };
			}
			const hmac = createHmac('sha256', signatureKey);
			hmac.update(JSON.stringify(bodyData));
			const expectedSignature = hmac.digest('hex');
			if (incomingSignature !== expectedSignature) {
				return { noWebhookResponse: true };
			}
		}

		return {
			workflowData: [this.helpers.returnJsonArray([bodyData])],
		};
	}
}
