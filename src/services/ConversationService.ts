import JsonService from './JsonService';
import axios, { AxiosInstance } from 'axios';
import config from '../config/config';


class ConversationService {
	public instanceAxios: AxiosInstance
	private jsonService: JsonService;
	private static jsonServiceStatic: JsonService;

	constructor(tokenJSON) {
		this.jsonService = new JsonService();
		this.instanceAxios = axios.create({
			baseURL: 'https://salesiq.zoho.com/api/v2/sales1.oceanomedicina/',
			timeout: 1000,
			headers: {
				'Authorization': `Zoho-oauthtoken ${tokenJSON['access_token']}`
			}
		});
	}

	public GetAllConversations() {
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
				ConversationService.SaveConversationsJson(response.data);
				this.parent.SearchVisitorsInConversations(response.data.data);
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

	private static SaveConversationsJson(objectToSave: any) {
		this.jsonServiceStatic.saveJson(`Files/${config.apps.conversation.fielname}.json`,objectToSave);
	}

	private static SaveConversationJson(objectToSave: any,id: string) {
		this.jsonServiceStatic.saveJson(`Files/Conversations/${config.apps.conversation.fielname}_${id}.json`,objectToSave);
	}

	private static SaveLeadJson(objectToSave: any) {
		this.jsonServiceStatic.saveJson(`Files/Leads/lead_${objectToSave.id}.json`,objectToSave);
	}

	private SaveLeadsJson(stringToAdd: string) {
		this.jsonService.updateFile(`Files/Conversations_x_Leads.json`,stringToAdd);
	}

	public async SearchVisitorsInConversations(conversationsResponse: Array<any>) {
		let listIdLeads: Array<string> = [];
		await this.jsonService.createFile(`Files/Conversations_x_Leads.json`,`{"data":[`)
		let promise = new Promise((resolve, reject) => {
			for (let conversationResponse of conversationsResponse) {
				/*
				conversationResponse['visitor'].id &&
				this.SearchConversation(conversationResponse['id']);
				 */
				let jsonService = new JsonService();
				let jsonConversation = jsonService.readJson(`Files/Conversations/${config.apps.conversation.fielname}_${conversationResponse['id']}.json`);
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
					this.SaveLeadsJson(`{"conversation_id":${conversationResponse.conversation_details.id},"lead_id":${conversationResponse.conversation_details.ex_info['2'].LEADID},"pp_conversation":"${customer_info}"},`)
				}
			}
			resolve("");
		});

		if (conversationsResponse && conversationsResponse.length>0)
			promise.finally(() => {
				this.SaveLeadsJson("]}")
				console.log(listIdLeads.join());
			});
	}

	public GetJSONAllConversations() {
		return this.jsonService.readJson(`Files/${config.apps.conversation.fielname}.json`);
	}
}

export default ConversationService;