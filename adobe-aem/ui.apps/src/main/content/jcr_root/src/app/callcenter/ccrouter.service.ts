import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, ActivatedRoute, Router, Params } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import { CislService } from './../util/util.cisl.service';




@Injectable()
export class CCRouteService implements CanActivate {

    private ticketId:string  = "";
    private userId:string ="";

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private cislService: CislService) { }
    canActivate(): boolean {        
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.userId = params['user'];
            this.ticketId = params['ticket'];
      });      
      return true;
    }
    getTicketId():any{
        return this.ticketId;
    }
    getUserId():any{
        return this.userId;
    }    
}
