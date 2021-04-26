import fs from 'fs';

class JsonService {
	constructor() {}
	saveJson(path: string, objectToSave: any) {
		fs.writeFile(path, JSON.stringify(objectToSave),'utf8', (err) => { 
			if (err) throw err; 
				console.log('The file has been saved!'); 
		});
	}
}

export default JsonService;