import JsonService from './JsonService';
import axios, { AxiosInstance } from 'axios';
import config from '../config/config';
import JSONbig from 'json-bigint';

function SaveConversationsJson(objectToSave: any) {
	JsonService.saveJson(`Files/${config.apps.conversation.fielname}.json`,objectToSave);
}

function SaveLeadsJson(stringToAdd: string) {
	JsonService.updateFile(`Files/Conversations_x_Leads.json`,stringToAdd);
}

function SaveConversationLeadsDiffJson(stringToAdd: string) {
	JsonService.updateFile(`Files/Conversations_x_Leads_Diff.json`,stringToAdd);
}

class ConversationService {
	private instanceAxios: AxiosInstance;

	constructor(tokenJSON) {
		this.instanceAxios = axios.create({
			baseURL: 'https://salesiq.zoho.com/api/v2/sales1.oceanomedicina/',
			timeout: 10000,
			headers: {
				'Authorization': `Zoho-oauthtoken ${tokenJSON['access_token']}`
			},
			transformResponse: data => JSONbig.parse(data)
		});
	}

	public async GetAllConversations(): Promise<any> {
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
				return response.data;
				//this.SearchVisitorsInConversations(response.data.data);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				return(null);
			});
	}

	public async SearchConversation(id_conversation: string): Promise<any> {
		this.instanceAxios.get(`conversations/${id_conversation}/visitor`)
			.then(function (response) {
				// handle success
				//console.log(response.data);
				ConversationService.SaveConversationJson(response.data,id_conversation);
				return response.data;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
	}

	private static SaveConversationJson(objectToSave: any,id: string) {
		JsonService.saveJson(`Files/Conversations/${config.apps.conversation.fielname}_${id}.json`,objectToSave);
	}

	private static SaveLeadJson(objectToSave: any) {
		JsonService.saveJson(`Files/Leads/lead_${objectToSave.id}.json`,objectToSave);
	}

	public async SearchVisitorsInConversations(conversationsResponse: Array<any>) {
		let listIdLeads: Array<string> = [];
		await JsonService.createFile(`Files/Conversations_x_Leads.json`,`{"data":[`)
		let promise = new Promise(async (resolve, reject) => {
			for (let conversationResponse of conversationsResponse) {
				//console.log(conversationResponse);
				if (conversationResponse['visitor'].id)
				{
					//let jsonConversation = await this.SearchConversation(conversationResponse['id']);
					//console.log(jsonConversation);
					let jsonConversation = JsonService.readJson(`Files/Conversations/${config.apps.conversation.fielname}_${conversationResponse['id']}.json`);
					let customer_info = '';
					if(conversationResponse.customer_info && conversationResponse.customer_info.pp)
						customer_info = conversationResponse.customer_info.pp;
					if (jsonConversation
						&& jsonConversation['data']
						&& jsonConversation['data'].conversation_details
						&& jsonConversation['data'].conversation_details.ex_info
						&& jsonConversation['data'].conversation_details.ex_info['2']
						&& jsonConversation['data'].conversation_details.ex_info['2'].LEADID
					)
					{
						let LeadID:string = jsonConversation['data'].conversation_details.ex_info['2'].LEADID.toString();
						listIdLeads.push(LeadID);
						let jsonLead = JsonService.readJson(`Files/Leads/${config.apps.lead.fielname}_${LeadID}.json`);
						//console.log(conversationResponse);
						//ConversationService.SaveLeadJson({"conversation_id":conversationResponse.conversation_details.id,lead_id:conversationResponse.conversation_details.ex_info['2'].LEADID,"pp_conversation":customer_info})
						SaveLeadsJson(`
						{
							"conversation_id":${jsonConversation['data'].conversation_details.id},
							"lead_id":${LeadID},
							"pp_conversation":"${customer_info}",
							"pp_lead":"${jsonLead ? jsonLead['pp'] : ''}",
							"api_url_conversation":"https://salesiq.zoho.com/api/v2/sales1.oceanomedicina/conversations/${jsonConversation['data'].conversation_details.id}/visitor",
							"api_url_lead":"https://www.zohoapis.com/crm/v2/Leads/${LeadID}",
							"url_conversation":"https://salesiq.zoho.com/sales1.oceanomedicina/allchats/${jsonConversation['data'].conversation_details.id}",
							"url_lead":"https://crm.zoho.com/crm/org631172874/tab/Leads/${LeadID}/"
						},
					`)
					}
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

	public async GetFinalJson() {
		let jsonConversations_x_Leads = await JsonService.readJson(`Files/Conversations_x_Leads.json`);
		await JsonService.createFile(`Files/Conversations_x_Leads_Diff.json`,`{"data":[`)
		let promise = new Promise(async (resolve, reject) => {
			let saeta: Array<Conversation_x_Lead> = jsonConversations_x_Leads['data'];
			for (let conversationXLead of saeta) {
				if (
					conversationXLead.pp_conversation != "" &&
					conversationXLead.pp_conversation != conversationXLead.pp_lead
				)
					SaveConversationLeadsDiffJson(`
{
	"conversation_id":${(conversationXLead.conversation_id)},
	"lead_id":${(conversationXLead.lead_id)},
	"pp_conversation":"${(conversationXLead.pp_conversation)}",
	"pp_lead":"${(conversationXLead.pp_lead)}",
	"api_url_conversation":"${(conversationXLead.api_url_conversation)}",
	"api_url_lead":"${(conversationXLead.api_url_lead)}",
	"url_conversation":"${conversationXLead.url_conversation}",
	"url_lead":"${(conversationXLead.url_lead)}"
},`)
			}
			resolve("");
		});
		promise.finally(() => {
			SaveConversationLeadsDiffJson("]}")
		});
	}
}

class Conversation_x_Lead {
	conversation_id: string;
	lead_id: string;
	pp_conversation: string;
	pp_lead: string;
	api_url_conversation: string;
	api_url_lead: string;
	url_conversation: string;
	url_lead: string;
}

export default ConversationService;