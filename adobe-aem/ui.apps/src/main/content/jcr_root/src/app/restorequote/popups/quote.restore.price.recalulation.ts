import { Component,OnInit, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'quote-restore-price-recalulation',
    templateUrl: './quote.restore.price.recalulation.html'
})

export class QuoteRestorePriceRecalculation implements OnInit {
    constructor(){}
    @Output() onRecalculateOkClick: EventEmitter<any> = new EventEmitter<any>();
    ngOnInit(){}    
    clickOk(){
       this.onRecalculateOkClick.emit(); 
    }
}
