import {HttpUtils} from "./http-utils";
import config from "../config/config";

export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';

    static setAuthInfo(accessToken, refreshToken, userInfo = null){
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if(userInfo){
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    static removeAuthInfo(){
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    static getAuthInfo(key = null){
        if(key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)){
            return localStorage.getItem(key);
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey),
            }
        }
    }

    static async performLogin(email, password, rememberMe) {
        const result = await HttpUtils.request('/login', 'POST', false, { email, password, rememberMe });

        if (result.error || !result.response || (result.response && (!result.response.tokens || !result.response.user))) {
            throw new Error('Login failed');
        }

        this.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
            id: result.response.user.id,
            name: result.response.user.name + ' ' + result.response.user.lastName
        });
    }

    static async updateRefreshToken(){
        let result = false;
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        if(refreshToken){
            const response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if(response && response.status === 200){
                const tokens = await response.json();
                if(tokens && !tokens.error){
                    this.setAuthInfo(tokens.tokens.accessToken, tokens.tokens.refreshToken);
                    result = true;
                }
            }
        }
        if(!result){
            this.removeAuthInfo();
        }
        return result;
    }
}