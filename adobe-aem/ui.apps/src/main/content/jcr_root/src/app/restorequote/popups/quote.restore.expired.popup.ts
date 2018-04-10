import { Component,OnInit, Output, Input, EventEmitter } from '@angular/core';
import {environment} from '../../../environments/environment';


@Component({
    selector: 'quote-restore-expired-quote',
    templateUrl: './quote.restore.expired.popup.html'
})

export class QuoteRestoreExpired implements OnInit {
    constructor(){}
    @Output() onClickNewQuote: EventEmitter<any> = new EventEmitter<any>();    
    
    ngOnInit(){
        console.log("QuoteRestoreExpired popup created");
    }    
    
    public clickGoToHomePage(){
        window.location.href = environment.retrievePopupCloseUrl;
    }

    
    public clickNewQuote(){        
        this.onClickNewQuote.emit();           
    }

    
} 