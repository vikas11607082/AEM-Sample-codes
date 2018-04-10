import { Injectable,EventEmitter,Output } from '@angular/core';

    @Injectable()
    export class AppErrorDispatcher {
        @Output() errorFound = new EventEmitter();
        @Output() closeErrorPopup = new EventEmitter();
        constructor() {}

        catchAndDispatchError(error) {
            console.log(error);
            let errorObj;
            if(error.error){
                errorObj = error.error;
            }
            
            if(errorObj){
                if(errorObj.errorType){
                    this.errorFound.emit(errorObj.errorType); 
                }  
            }
                       
        }

        dispatchCloseErrorPopup(){
            this.closeErrorPopup.emit();
        }
    }