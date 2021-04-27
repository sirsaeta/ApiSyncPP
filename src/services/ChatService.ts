import JsonService from './JsonService';
import axios from 'axios';
import AuthService from "./AuthService";


class ChatService {
	public instanceAxios

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
		this.instanceAxios.get('/chats')
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

	private static SaveChatsJson(objectToSave) {
		let jsonService = new JsonService();
		jsonService.saveJson('Files/chats.json',objectToSave);
	}
}

export default ChatService;