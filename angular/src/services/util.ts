import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js'

@Injectable()
export class Util {
    constructor() { }

    generateState() {
        return this.generateCode(64)
    }

    generateCodeChallenge(codeVerifier) {
        return this.base64URL(CryptoJS.SHA256(codeVerifier))
    }

    generateCodeVerifier() {
        return this.generateCode(58)
    }

    generateCode(length) {
        var code = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            code += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return code;
    }

    base64URL(string) {
        return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    }

}