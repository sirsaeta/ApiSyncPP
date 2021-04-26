import express from 'express';
import router from './routes/app';
import ChatService from './services/ChatService';
import AuthService from './services/AuthService';
const app = express();
const port = 3000;
const chatService = new ChatService();
const authService = new AuthService();

//chatService.saveChatsJson();
authService.RefreshToken();
app.use('/', router);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;