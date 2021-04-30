//import express from 'express';
//import router from './routes/app';
import ChatService from './services/ChatService';
import ConversationService from './services/ConversationService';
import config from './config/config';
//const app = express();
const port = 3000;

for (let [appsKey, appsValue] of Object.entries(config.apps)) {
	if (appsValue['enabled'] && appsKey==='chat')
	{
		const chatService = new ChatService();
		chatService.GetAllChat();
	}
	else if(appsValue['enabled'] && appsKey==='conversation')
	{
		const conversationService = new ConversationService();
		//conversationService.GetAllConversations();
		let jsonConversations = conversationService.GetJSONAllConversations();
		conversationService.SearchVisitorsInConversations(jsonConversations['data']);
	}
}
//authService.RefreshToken();
/*app.use('/', router);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})*/

//module.exports = app;