import {Injectable,EventEmitter,Output, Component} from '@angular/core';

@Injectable()
export class LogoutService { 
    @Output() confirmLogout = new EventEmitter();
    @Output() closeLogout = new EventEmitter();

    constructor(){}  
   
    
    showLogoutConfirm(data) {
        this.confirmLogout.emit(data);
    }

    closeLogoutPopup(data){
        this.closeLogout.emit(data);
    }
}