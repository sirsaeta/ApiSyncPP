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
			baseURL: 'https://salesiq.zoho.com/api/v1/sales1.oceanomedicina/',
			timeout: 1000,
			headers: {
				'Authorization': `Zoho-oauthtoken ${tokenJSON['access_token']}`
			}
		});
	}

	public GetAllConversations() {
		this.instanceAxios.get(`/conversations?attender_id=${config.conversation.attender_id}&limits=${config.conversation.limit}`)
			.then(function (response) {
				// handle success
				console.log(response.data);
				ConversationService.SaveConversationsJson(response.data);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}

	public SearchConversation() {
		axios.get('/conversations?ID=12345')
			.then(function (response) {
				// handle success
				console.log(response);
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
		jsonService.saveJson(`Files/${config.conversation.fielname}.json`,objectToSave);
	}
}

export default ConversationService;