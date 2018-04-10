import { Component,OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'validation-error',
     templateUrl: './validationErrorPopup.component.html'
})

export class ValidationErrorPopup implements OnInit {
    @Output() hideErrorPopup: EventEmitter<any> = new EventEmitter<any>();

    constructor(){}   
    ngOnInit(){}    
    hidePopup(){       
        //this.appErrorDispatcher.dispatchCloseErrorPopup();
        this.hideErrorPopup.emit(false);
    }   
}

