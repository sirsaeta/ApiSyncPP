import JsonService from './JsonService';
import axios, { AxiosInstance } from 'axios';
import config from '../config/config';

function SaveLeadsJsonString(stringToAdd: string) {
	JsonService.updateFile(`Files/Leads.json`,stringToAdd);
}

function SaveLeadJson(objectToSave: any,id: string) {
	JsonService.saveJson(`Files/Leads/lead_${id}.json`,objectToSave);
}

class LeadService {
	public instanceAxios: AxiosInstance

	constructor(tokenJSON) {
		this.instanceAxios = axios.create({
			baseURL: 'https://www.zohoapis.com/crm/v2/',
			timeout: 1000,
			headers: {
				'Authorization': `Zoho-oauthtoken ${tokenJSON['access_token']}`
			}
		});
	}

	public GetAllLeads() {
		let paramsConversation = config.apps.lead.params;
		let url: string = "Leads";
		if (Object.keys(paramsConversation).length>0) url += "?"
		let arrParams: Array<string>=[];
		for (let [paramKey,paramValue] of Object.entries(paramsConversation)) {
			arrParams.push(`${paramKey}=${paramValue}`)
		}
		url += arrParams.join("&");
		this.instanceAxios.get(url)
			.then(function (response) {
				// handle success
				//console.log(response.data);
				LeadService.SaveLeadsJson(response.data);
				this.parent.SearchVisitorsInConversations(response.data.data);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}

	public SearchLead(id: string) {
		this.instanceAxios.get(`Leads/${id}`)
			.then(function (response) {
				// handle success
				console.log(response.data);
				SaveLeadJson(response.data,id);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				// always executed
			});
	}

	private static SaveLeadsJson(objectToSave: any) {
		JsonService.saveJson(`Files/${config.apps.lead.fielname}.json`,objectToSave);
	}

	public async SearchLeadsInJSONtoJSON(jsonLeads: Array<any>) {
		//console.log(jsonLeads);
		for (let lead of jsonLeads) {
			//console.log(lead);
			SaveLeadJson(lead, lead['id']);
		}
	}

	public GetJSONAllLeads() {
		return JsonService.readJson(`Files/${config.apps.lead.fielname}.json`);
	}

}

export default LeadService;