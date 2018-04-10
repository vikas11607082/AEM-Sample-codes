import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UrlRetrieveServices implements CanActivate {

    public SALES_CHANNEL:string  = "";
    constructor(private router: Router) { }
    
    canActivate(): boolean {
        var url = window.location.href;
        if(url.indexOf("channel=") != (-1)){
            this.SALES_CHANNEL = url.substring(url.indexOf("channel=")+8,url.indexOf("#"));
        }     
        return true;
    }
    getSalesChannel():any{
        return this.SALES_CHANNEL;
    }    
}
