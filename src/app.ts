import AuthService from "./services/AuthService";
import ChatService from './services/ChatService';
import ConversationService from './services/ConversationService';
import LeadService from "./services/LeadService";
import config from './config/config';

const authService = new AuthService();
authService.GetToken().then((token)=>{
	for (let [appsKey, appsValue] of Object.entries(config.apps)) {
		if (appsValue['enabled'] && appsKey==='chat')
		{
			const chatService = new ChatService(token);
			chatService.GetAllChat();
		}
		else if(appsValue['enabled'] && appsKey==='lead')
		{
			const leadService = new LeadService(token);
			//leadService.GetAllLead();
			let jsonLeads = leadService.GetJSONAllConversations();
			leadService.SearchVisitorsInConversations(jsonLeads['data']);
		}
		else if(appsValue['enabled'] && appsKey==='conversation')
		{
			const conversationService = new ConversationService(token);
			//conversationService.GetAllConversations();
			let jsonConversations = conversationService.GetJSONAllConversations();
			conversationService.SearchVisitorsInConversations(jsonConversations['data']);
		}
	}
})