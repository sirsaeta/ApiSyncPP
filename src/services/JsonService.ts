import fs from 'fs';

class JsonService {
	constructor() {}
	async createFile(path: string, stringToAdd: string) {
		await fs.writeFile(path, stringToAdd, function (err) {
			if (err) throw err;
		});
	}

	updateFile(path: string, stringToAdd: string) {
		fs.appendFile(path, stringToAdd,'utf8', (err) => {
			if (err) throw err;
		});
	}

	saveJson(path: string, objectToSave: any) {
		fs.writeFile(path, JSON.stringify(objectToSave),'utf8', (err) => { 
			if (err) throw err; 
				console.log(`The file has been saved! ${path}`);
		});
	}

	readJson(path: string) : JSON {
		if(!this.fileExists)
			return null;
		let dataJason: Buffer = fs.readFileSync(path);
		return JSON.parse(dataJason.toString());
	}

	fileExists(path: string): boolean {
		try {
			fs.accessSync(path);
			return true;
		} catch (e) {
			return false;
		}
	}
}

export default JsonService;