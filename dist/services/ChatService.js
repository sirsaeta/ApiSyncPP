"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonService_1 = __importDefault(require("./JsonService"));
const axios_1 = __importDefault(require("axios"));
const AuthService_1 = __importDefault(require("./AuthService"));
const config_1 = __importDefault(require("../config/config"));
class ChatService {
    constructor() {
        const authService = new AuthService_1.default();
        let tokenJSON = authService.GetTokenSalesIQ();
        this.instanceAxios = axios_1.default.create({
            baseURL: 'https://salesiq.zoho.com/api/v1/sales1.oceanomedicina/',
            timeout: 1000,
            headers: {
                'Authorization': `Zoho-oauthtoken ${tokenJSON['access_token']}`
            }
        });
    }
    GetAllChat() {
        this.instanceAxios.get(`/chats?limits=${config_1.default.apps.chat.limit}`)
            .then(function (response) {
            // handle success
            console.log(response.data);
            ChatService.SaveChatsJson(response.data);
        })
            .catch(function (error) {
            // handle error
            console.log(error);
        })
            .then(function () {
            // always executed
        });
    }
    SearchChat() {
        axios_1.default.get('/chats?ID=12345')
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
    static SaveChatsJson(objectToSave) {
        let jsonService = new JsonService_1.default();
        jsonService.saveJson(`Files/${config_1.default.apps.chat.fielname}.json`, objectToSave);
    }
}
exports.default = ChatService;
//# sourceMappingURL=ChatService.js.map