import { Component,OnInit } from '@angular/core';
import { AppErrorDispatcher } from '../errorhandler/apperrordispatcher.service';

@Component({
    selector: 'error-pop-up',
     templateUrl: './errorpopup.html'
})

export class ErrorPopUp implements OnInit {
    constructor(private appErrorDispatcher:AppErrorDispatcher){}   
    ngOnInit(){}    
    hideSuccessPopup(){       
        this.appErrorDispatcher.dispatchCloseErrorPopup();
    }   
}

