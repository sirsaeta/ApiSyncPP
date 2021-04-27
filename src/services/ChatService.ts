import JsonService from './JsonService';
import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://salesiq.zoho.com/api/v1/sales1.oceanomedicina/',
	timeout: 1000
});

class ChatService {
	constructor() { }

	public searchChat() {
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

	private saveChatsJson() {
		let objectToSave = {variable:'1',variable2:'2'};
		let jsonService = new JsonService();
		jsonService.saveJson('archivo.json',objectToSave);
	}
}

export default ChatService;