import express from 'express';
import router from './routes/app';
import ChatService from './services/ChatService';
const app = express();
const port = 3000;
const chatService = new ChatService();

chatService.GetAllChat();
//authService.RefreshToken();
/*app.use('/', router);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})*/

module.exports = app;