import axios from 'axios';
import config from '../config/config';

const axiosAuth = axios.create({
    baseURL: 'https://accounts.zoho.com/oauth/v2/token',
    timeout: 1000
});

class AuthService {
    constructor() { }

    public RefreshToken() {
        axiosAuth.post(`?refresh_token=${config.RefreshTokenSalesIQ}&client_id=${config.client_id}&client_secret=${config.client_secret}&grant_type=refresh_token`)
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
}

export default AuthService;