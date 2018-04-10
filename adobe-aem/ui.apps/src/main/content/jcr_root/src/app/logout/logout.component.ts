import {Injectable,EventEmitter,Output, Component} from '@angular/core';
import { LogoutService } from './logout.service';
import { CislService} from '../util/util.cisl.service';

@Component({
    selector: 'logout-confirm',
    templateUrl: './logout.component.html'
})


export class LogoutComponent { 

    constructor(private logoutService: LogoutService, private cislService: CislService){}  

    closeLogoutPopup(data){
        this.logoutService.closeLogoutPopup(data);
    }
    processLogout() {
       this.closeLogoutPopup(false);
       location.assign("/cclogout");
    }   
}