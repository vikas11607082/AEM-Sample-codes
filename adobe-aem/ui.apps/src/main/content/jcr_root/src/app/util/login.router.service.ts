import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthLoginService } from '../util/auth.login.service';



@Injectable()
export class LoginRouteServices implements CanActivate {

    constructor(private router: Router, private loginChek: AuthLoginService) { }
    canActivate(): boolean {
        //TODO: fixme or delete me
        return true;
    }

}
