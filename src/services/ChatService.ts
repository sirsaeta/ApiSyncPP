import JsonService from './JsonService';

class ChatService {
	constructor() {}
	saveChatsJson() {
		let objectToSave = {variable:'1',variable2:'2'};
		let jsonService = new JsonService();
		jsonService.saveJson('archivo.json',objectToSave);
	}
}

export default ChatService;