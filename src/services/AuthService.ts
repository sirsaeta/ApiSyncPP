import axios from 'axios';
import config from '../config/config';
import JsonService from './JsonService';

class AuthService {
	constructor() { }

	public async GetToken() {
		let jsonService = new JsonService();
		let jsonDataToken = jsonService.readJson(`src/config/${config.SalesIQ.fielname}.json`);
		if(!jsonDataToken || Date.now() > jsonDataToken['expires_date']*1)
			this.RefreshToken(config.SalesIQ.RefreshToken,config.SalesIQ.client_id,config.SalesIQ.client_secret,config.SalesIQ.fielname)
				.then(function (jsonDataToken) {
					return jsonDataToken;
				});
		return jsonDataToken
	}

	private async RefreshToken(refresh_token: string,client_id: string,client_secret: string,filename: string) : Promise<any> {
		const options: any = {
			method: 'POST',
			url: `https://accounts.zoho.com/oauth/v2/token?refresh_token=${refresh_token}&client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token`,
			headers: {'content-type': 'application/form-data'},
		};
		let result: any = {};
		axios.request(options)
			.then(function (response) {
				// handle success
				let data = response.data;
				let now = Date.now();
				data.expires_date = now + data.expires_in * 1000;
				AuthService.SaveTokenJson(data, filename);
				result = data;
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.finally(function () {
				// always executed
				return result;
			});
	}

	private static SaveTokenJson(objectToSave,filename: string) {
		let jsonService = new JsonService();
		jsonService.saveJson(`src/config/${filename}.json`,objectToSave);
	}
}

export default AuthService;