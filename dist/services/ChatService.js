"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonService_1 = __importDefault(require("./JsonService"));
const axios_1 = __importDefault(require("axios"));
const instance = axios_1.default.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});
class ChatService {
    constructor() { }
    searchChat() {
        axios_1.default.get('/user?ID=12345')
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
    saveChatsJson() {
        let objectToSave = { variable: '1', variable2: '2' };
        let jsonService = new JsonService_1.default();
        jsonService.saveJson('archivo.json', objectToSave);
    }
}
exports.default = ChatService;
//# sourceMappingURL=ChatService.js.map