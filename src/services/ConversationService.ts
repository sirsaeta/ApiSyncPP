import JsonService from './JsonService';
import axios, { AxiosInstance } from 'axios';
import AuthService from "./AuthService";
import config from '../config/config';


class ConversationService {
	public instanceAxios: AxiosInstance

	constructor() {
		const authService = new AuthService();
		let tokenJSON = authService.GetTokenSalesIQ();
		this.instanceAxios = axios.create({
			baseURL: 'https://salesiq.zoho.com/api/v2/sales1.oceanomedicina/',
			timeout: 1000,
			headers: {
				'Authorization': `Zoho-oauthtoken ${tokenJSON['access_token']}`
			}
		});
	}

	public GetAllConversations() {
		let dataConversation = config.apps.conversation;
		this.instanceAxios.get(`conversations?attender_id=${dataConversation.attender_id}&limits=${dataConversation.limit}&status=${dataConversation.status}`)
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
		let jsonService = new JsonService();
		jsonService.saveJson(`Files/${config.apps.conversation.fielname}.json`,objectToSave);
	}

	private static SaveConversationJson(objectToSave: any,id: string) {
		let jsonService = new JsonService();
		jsonService.saveJson(`Files/Conversations/${config.apps.conversation.fielname}_${id}.json`,objectToSave);
	}

	public SearchVisitorsInConversations(conversationsResponse: Array<any>) {
		if (conversationsResponse && conversationsResponse.length>0)
			for (let conversationResponse of conversationsResponse) {
				/*
				conversationResponse['visitor'].id &&
				this.SearchConversation(conversationResponse['id']);
				 */
				let jsonService = new JsonService();
				let jsonConversation = jsonService.readJson(`Files/Conversations/${config.apps.conversation.fielname}_${conversationResponse['id']}.json`);
				this.SearchLeadInVisitors(jsonConversation['data'])
			}
	}

	public GetJSONAllConversations() {
		let jsonService = new JsonService();
		return jsonService.readJson(`Files/${config.apps.conversation.fielname}.json`);
	}

	public SearchLeadInVisitors(conversationsResponse: Array<any>) {
		if (conversationsResponse && conversationsResponse.length>0)
			for (let conversationResponse of conversationsResponse) {
				/*
				conversationResponse['visitor'].id &&
				this.SearchConversation(conversationResponse['id']);
				 */
				let jsonService = new JsonService();
				jsonService.readJson(`Files/Conversations/${config.apps.conversation.fielname}_${conversationResponse['id']}.json`);
			}
	}
}

export default ConversationService;