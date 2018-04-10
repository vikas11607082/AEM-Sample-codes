import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthOTPLoginService } from '../util/auth.otplogin.service';



@Injectable()
export class LoginOTPRouterServices implements CanActivate {

    constructor(private router: Router, private loginChek: AuthOTPLoginService) { }
    canActivate(): boolean {
        if (this.loginChek.getUserLogin()) {
            return true;
        } else {
            return false;
        }
    }

}
