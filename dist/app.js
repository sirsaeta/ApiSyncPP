"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./routes/app"));
const ChatService_1 = __importDefault(require("./services/ChatService"));
const AuthService_1 = __importDefault(require("./services/AuthService"));
const app = express_1.default();
const port = 3000;
const chatService = new ChatService_1.default();
const authService = new AuthService_1.default();
//chatService.saveChatsJson();
authService.RefreshToken();
app.use('/', app_1.default);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
module.exports = app;
//# sourceMappingURL=app.js.map