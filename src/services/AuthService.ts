import axios from 'axios';
import config from '../config/config';

const options: any = {
    method: 'POST',
    url: `https://accounts.zoho.com/oauth/v2/token?refresh_token=${config.RefreshTokenSalesIQ}&client_id=${config.client_id}&client_secret=${config.client_secret}&grant_type=refresh_token`,
    headers: {'content-type': 'application/form-data'},
};

class AuthService {
    constructor() { }

    public RefreshToken() {
        axios.request(options)
            .then(function (response) {
                // handle success
                console.log(response.data);
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