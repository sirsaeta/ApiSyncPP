"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class JsonService {
    constructor() { }
    saveJson(path, objectToSave) {
        fs_1.default.writeFile(path, JSON.stringify(objectToSave), 'utf8', (err) => {
            if (err)
                throw err;
            console.log('The file has been saved!');
        });
    }
}
exports.default = JsonService;
//# sourceMappingURL=JsonService.js.map