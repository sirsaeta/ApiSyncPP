"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class JsonService {
    constructor() { }
    createFile(path, stringToAdd) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.default.writeFile(path, stringToAdd, function (err) {
                if (err)
                    throw err;
            });
        });
    }
    updateFile(path, stringToAdd) {
        fs_1.default.appendFile(path, stringToAdd, 'utf8', (err) => {
            if (err)
                throw err;
        });
    }
    saveJson(path, objectToSave) {
        fs_1.default.writeFile(path, JSON.stringify(objectToSave), 'utf8', (err) => {
            if (err)
                throw err;
            console.log(`The file has been saved! ${path}`);
        });
    }
    readJson(path) {
        if (!this.fileExists)
            return null;
        let dataJason = fs_1.default.readFileSync(path);
        return JSON.parse(dataJason.toString());
    }
    fileExists(path) {
        try {
            fs_1.default.accessSync(path);
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
exports.default = JsonService;
//# sourceMappingURL=JsonService.js.map