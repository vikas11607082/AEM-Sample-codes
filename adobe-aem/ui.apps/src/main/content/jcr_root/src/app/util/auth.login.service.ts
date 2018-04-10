import { Injectable } from '@angular/core';
@Injectable()
export class AuthLoginService {
    private isUserLogin = false;
    public setUserLogin(val: boolean) {
        this.isUserLogin = val;
        sessionStorage.setItem("isLogin", JSON.stringify(val));
    }
    getUserLogin(): boolean {
        this.isUserLogin = JSON.parse(sessionStorage.getItem("isLogin"));
        return this.isUserLogin;
    }
}