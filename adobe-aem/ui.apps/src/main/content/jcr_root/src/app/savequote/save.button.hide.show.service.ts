import {Injectable,EventEmitter,Output} from '@angular/core';

@Injectable()
export class SaveButtonHideShowService{
    @Output() HideSaveButton = new EventEmitter();
    @Output() ShowSaveButton = new EventEmitter();
    @Output() ShowQuoteId = new EventEmitter();

    constructor(){}

    public showSaveButton(){
        this.ShowSaveButton.emit();
    }

    public hideSaveButton(){
        this.HideSaveButton.emit();
    }

    public showQuoteId(){
        this.ShowQuoteId.emit();
    }
 }