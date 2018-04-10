import { Component,OnInit, Output, Input, EventEmitter } from '@angular/core';


@Component({
    selector: 'quote-restore-offer-unpaid',
    templateUrl: './quote.restore.offer.unpaid.popup.html'
})

export class QuoteRestoreOfferUnpaid implements OnInit {
    constructor(){}
    @Output() onClickSendOfferAgain: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClickPayNow: EventEmitter<any> = new EventEmitter<any>();

    
    ngOnInit(){
        console.log("QuoteRestoreOfferUnpaid popup created");
    }
    
    //Call offer document service to send offer document.
    // Show email link send popup
    public clickSendOfferAgain(){
        this.onClickSendOfferAgain.emit();
    }

    // Navigate to thankyou page.
    public clickPayNow(){        
        this.onClickPayNow.emit();           
    }

    
} 