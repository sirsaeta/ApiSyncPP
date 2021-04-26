"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonService_1 = __importDefault(require("./JsonService"));
class ChatService {
    constructor() { }
    saveChatsJson() {
        let objectToSave = { variable: '1', variable2: '2' };
        let jsonService = new JsonService_1.default();
        jsonService.saveJson('archivo.json', objectToSave);
    }
}
exports.default = ChatService;
//# sourceMappingURL=ChatService.js.map