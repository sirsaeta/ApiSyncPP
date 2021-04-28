"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ChatService_1 = __importDefault(require("./services/ChatService"));
const ConversationService_1 = __importDefault(require("./services/ConversationService"));
const config_1 = __importDefault(require("./config/config"));
const app = express_1.default();
const port = 3000;
for (let [appsKey, appsValue] of Object.entries(config_1.default.apps)) {
    if (appsValue['enabled'] && appsKey === 'chat') {
        const chatService = new ChatService_1.default();
        chatService.GetAllChat();
    }
    else if (appsValue['enabled'] && appsKey === 'conversation') {
        const conversationService = new ConversationService_1.default();
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
module.exports = app;
//# sourceMappingURL=app.js.map