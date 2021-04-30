import JsonService from './JsonService';
import axios, { AxiosInstance } from 'axios';
import AuthService from "./AuthService";
import config from '../config/config';


class LeadService {
	public instanceAxios: AxiosInstance
	private jsonService: JsonService;
	private static jsonServiceStatic: JsonService;

	constructor() {
		this.jsonService = new JsonService();
		const authService = new AuthService();
		let tokenJSON = authService.GetTokenSalesIQ();
		this.instanceAxios = axios.create({
			baseURL: 'https://www.zohoapis.com/crm/v2/',
			timeout: 1000,
			headers: {
				'Authorization': `Zoho-oauthtoken ${tokenJSON['access_token']}`
			}
		});
	}

	public GetAllLeads() {
		let paramsConversation = config.apps.lead.params;
		let url: string = "Leads";
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
				LeadService.SaveLeadsJson(response.data);
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

	public SearchLead(id: string) {
		this.instanceAxios.get(`Leads/${id}`)
			.then(function (response) {
				// handle success
				console.log(response.data);
				LeadService.SaveConversationJson(response.data,id);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}

	private static SaveLeadsJson(objectToSave: any) {
		this.jsonServiceStatic.saveJson(`Files/${config.apps.lead.fielname}.json`,objectToSave);
	}

	private static SaveConversationJson(objectToSave: any,id: string) {
		this.jsonServiceStatic.saveJson(`Files/Conversations/${config.apps.conversation.fielname}_${id}.json`,objectToSave);
	}

	private static SaveLeadJson(objectToSave: any) {
		this.jsonServiceStatic.saveJson(`Files/Leads/lead_${objectToSave.id}.json`,objectToSave);
	}

	private SaveLeadsJson(stringToAdd: string) {
		this.jsonService.updateFile(`Files/Leads.json`,stringToAdd);
	}

	public async SearchVisitorsInConversations(conversationsResponse: Array<any>) {
		await this.jsonService.createFile(`Files/Leads.json`,`{"data":[`)
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
				this.SearchLeadInVisitors(jsonConversation['data'], customer_info)
			}
			resolve("");
		});

		if (conversationsResponse && conversationsResponse.length>0)
			promise.finally(() => {
				this.SaveLeadsJson("]}")
			});
	}

	public GetJSONAllConversations() {
		return this.jsonService.readJson(`Files/${config.apps.conversation.fielname}.json`);
	}

	public SearchLeadInVisitors(conversationResponse: any, pp: string) {
		if (conversationResponse
			&& conversationResponse.conversation_details
			&& conversationResponse.conversation_details.ex_info
			&& conversationResponse.conversation_details.ex_info['2']
			&& conversationResponse.conversation_details.ex_info['2'].LEADID
		)
		{
			//ConversationService.SaveLeadJson({id:conversationResponse.conversation_details.ex_info['2'].LEADID,"pp":pp})
			this.SaveLeadsJson(`{"id":${conversationResponse.conversation_details.ex_info['2'].LEADID},"pp":"${pp}"},`)
		}
		//for (let conversationResponse in conversationResponse.) {
		/*
		conversationResponse['visitor'].id &&
		this.SearchConversation(conversationResponse['id']);
		 */
		//let jsonService = new JsonService();
		//jsonService.readJson(`Files/Conversations/${config.apps.conversation.fielname}_${conversationResponse['id']}.json`);


		//}
	}
}

export default LeadService;