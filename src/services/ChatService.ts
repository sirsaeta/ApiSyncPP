import JsonService from './JsonService';
import axios, { AxiosInstance } from 'axios';
import AuthService from "./AuthService";
import config from '../config/config';


class ChatService {
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

	public GetAllChat() {
		let paramsConversation = config.apps.chat.params;
		let url: string = "chats";
		if (Object.keys(paramsConversation).length>0) url += "?"
		let arrParams: Array<string>=[];
		for (let [paramKey,paramValue] of Object.entries(paramsConversation)) {
			arrParams.push(`${paramKey}=${paramValue}`)
		}
		url += arrParams.join("&");
		this.instanceAxios.get(url)
			.then(function (response) {
				// handle success
				console.log(response.data);
				ChatService.SaveChatsJson(response.data);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}

	public SearchChat() {
		axios.get('/chats?ID=12345')
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

	private static SaveChatsJson(objectToSave: any) {
		let jsonService = new JsonService();
		jsonService.saveJson(`Files/${config.apps.chat.fielname}.json`,objectToSave);
	}
}

export default ChatService;