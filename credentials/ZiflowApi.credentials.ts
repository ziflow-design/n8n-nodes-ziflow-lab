import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ZiflowApi implements ICredentialType {
	name = 'ziflowApi';
	displayName = 'Ziflow API';
	icon = 'file:ziflow.svg' as const;
	documentationUrl = 'https://docs.ziflow.com/en/api-documentation';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				apikey: '={{$credentials.apiKey}}',
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.ziflow.io/v1',
			url: '/users',
			qs: { count: 1 },
		},
	};
}
