import JsonService from './JsonService';
import axios, { AxiosInstance } from 'axios';
import config from '../config/config';


class ChatService {
	public instanceAxios: AxiosInstance

	constructor(tokenJSON) {
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

	private static SaveChatsJson(objectToSave: any) {
		JsonService.saveJson(`Files/${config.apps.chat.fielname}.json`,objectToSave);
	}
}

export default ChatService;