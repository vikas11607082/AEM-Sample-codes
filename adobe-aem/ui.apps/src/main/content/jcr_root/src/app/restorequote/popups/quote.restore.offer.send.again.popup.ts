import { Component,OnInit, Output, Input, EventEmitter } from '@angular/core';


@Component({
    selector: 'quote-restore-offer-send-again',
    templateUrl: './quote.restore.offer.send.again.popup.html'
})

export class QuoteRestoreOfferSendAgain implements OnInit {
    constructor(){}
    @Output() onClickCloseSendOfferAgain: EventEmitter<any> = new EventEmitter<any>();  

    
    ngOnInit(){
        console.log("QuoteRestoreOfferSendAgain popup created");
    }

    //Call offer document service to send offer document.
    // Show email link send popup
    public clickClosePopup(){
        this.onClickCloseSendOfferAgain.emit();
    }

  
    
} 