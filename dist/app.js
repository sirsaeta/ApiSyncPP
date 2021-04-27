"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ChatService_1 = __importDefault(require("./services/ChatService"));
const app = express_1.default();
const port = 3000;
const chatService = new ChatService_1.default();
chatService.GetAllChat();
//authService.RefreshToken();
/*app.use('/', router);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})*/
module.exports = app;
//# sourceMappingURL=app.js.map