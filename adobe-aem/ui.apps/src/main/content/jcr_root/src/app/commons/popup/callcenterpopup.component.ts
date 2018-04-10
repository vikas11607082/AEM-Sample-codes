import { Component,OnInit } from '@angular/core';
import { AppErrorDispatcher } from '../errorhandler/apperrordispatcher.service';

@Component({
    selector: 'call-pop-up',
    templateUrl: './callcenterpopup.html'
})

export class CallPopUp implements OnInit {
    constructor(private appErrorDispatcher:AppErrorDispatcher){}   
    ngOnInit(){}    
    hideSuccessPopup(){       
        this.appErrorDispatcher.dispatchCloseErrorPopup();
    }   
}
