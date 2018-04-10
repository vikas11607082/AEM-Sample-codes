import { Injectable } from '@angular/core';
@Injectable()
export class AuthOTPLoginService {
    private isUserLogin = false;
    public setUserLogin(val: boolean) {
        this.isUserLogin = val;
        sessionStorage.setItem("isOtpLogin", JSON.stringify(val));
    }
    getUserLogin(): boolean {
        this.isUserLogin = JSON.parse(sessionStorage.getItem("isOtpLogin"));
        return this.isUserLogin;
    }
}