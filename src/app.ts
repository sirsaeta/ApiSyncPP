import express from 'express';
import router from './routes/app';
import ChatService from './services/ChatService';
import config from './config/config';
const app = express();
const port = 3000;
const chatService = new ChatService();

if (config.chat.enabled) {
	chatService.GetAllChat();
}
if (config.conversation.enabled) {
	chatService.GetAllChat();
}
//authService.RefreshToken();
/*app.use('/', router);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})*/

module.exports = app;