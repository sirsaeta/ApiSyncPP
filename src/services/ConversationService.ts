import JsonService from './JsonService';
import axios, { AxiosInstance } from 'axios';
import config from '../config/config';

function SaveConversationsJson(objectToSave: any) {
	JsonService.saveJson(`Files/${config.apps.conversation.fielname}.json`,objectToSave);
}

function SaveLeadsJson(stringToAdd: string) {
	JsonService.updateFile(`Files/Conversations_x_Leads.json`,stringToAdd);
}

class ConversationService {
	public instanceAxios: AxiosInstance

	constructor(tokenJSON) {
		this.instanceAxios = axios.create({
			baseURL: 'https://salesiq.zoho.com/api/v2/sales1.oceanomedicina/',
			timeout: 10000,
			headers: {
				'Authorization': `Zoho-oauthtoken ${tokenJSON['access_token']}`
			}
		});
	}

	public async GetAllConversations() {
		let paramsConversation = config.apps.conversation.params;
		let url: string = "conversations";
		if (Object.keys(paramsConversation).length>0) url += "?"
		let arrParams: Array<string>=[];
		for (let [paramKey,paramValue] of Object.entries(paramsConversation)) {
			arrParams.push(`${paramKey}=${paramValue}`)
		}
		url += arrParams.join("&");
		this.instanceAxios.get(url)
			.then(function (response) {
				// handle success
				//console.log(response.data);
				SaveConversationsJson(response.data);
				ConversationService.SearchVisitorsInConversations(response.data.data);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}

	public SearchConversation(id_conversation: string) {
		this.instanceAxios.get(`conversations/${id_conversation}/visitor`)
			.then(function (response) {
				// handle success
				console.log(response.data);
				ConversationService.SaveConversationJson(response.data,id_conversation);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}

	private static SaveConversationJson(objectToSave: any,id: string) {
		JsonService.saveJson(`Files/Conversations/${config.apps.conversation.fielname}_${id}.json`,objectToSave);
	}

	private static SaveLeadJson(objectToSave: any) {
		JsonService.saveJson(`Files/Leads/lead_${objectToSave.id}.json`,objectToSave);
	}

	public static async SearchVisitorsInConversations(conversationsResponse: Array<any>) {
		let listIdLeads: Array<string> = [];
		await JsonService.createFile(`Files/Conversations_x_Leads.json`,`{"data":[`)
		let promise = new Promise((resolve, reject) => {
			for (let conversationResponse of conversationsResponse) {
				/*
				conversationResponse['visitor'].id &&
				this.SearchConversation(conversationResponse['id']);
				 */
				let jsonConversation = JsonService.readJson(`Files/Conversations/${config.apps.conversation.fielname}_${conversationResponse['id']}.json`);
				let customer_info = '';
				if(conversationResponse.customer_info && conversationResponse.customer_info.pp)
					customer_info = conversationResponse.customer_info.pp;
				if (jsonConversation['data']
					&& jsonConversation['data'].conversation_details
					&& jsonConversation['data'].conversation_details.ex_info
					&& jsonConversation['data'].conversation_details.ex_info['2']
					&& jsonConversation['data'].conversation_details.ex_info['2'].LEADID
				)
				{
					listIdLeads.push(jsonConversation['data'].conversation_details.ex_info['2'].LEADID);
					//ConversationService.SaveLeadJson({"conversation_id":conversationResponse.conversation_details.id,lead_id:conversationResponse.conversation_details.ex_info['2'].LEADID,"pp_conversation":customer_info})
					SaveLeadsJson(`
						{
							"conversation_id":${conversationResponse.conversation_details.id},
							"lead_id":${conversationResponse.conversation_details.ex_info['2'].LEADID},
							"pp_conversation":"${customer_info}",
							"url_conversation":"https://salesiq.zoho.com/api/v2/sales1.oceanomedicina/conversations/${conversationResponse.conversation_details.id}/visitor",
							"url_lead":"https://www.zohoapis.com/crm/v2/Leads/${conversationResponse.conversation_details.ex_info['2'].LEADID}"
						},
					`)
				}
			}
			resolve("");
		});

		if (conversationsResponse && conversationsResponse.length>0)
			promise.finally(() => {
				SaveLeadsJson("]}")
				console.log(listIdLeads.join());
			});
	}

	public GetJSONAllConversations() {
		return JsonService.readJson(`Files/${config.apps.conversation.fielname}.json`);
	}
}

export default ConversationService;