import {Injectable,EventEmitter,Output} from '@angular/core';
import { SaveQuotePageToEntityMappingService } from './quote.save.page.entity.mapping';
import { CislService } from '../util/util.cisl.service';


@Injectable()
export class SaveQuoteService{ 
    constructor(private _SaveQuotePageToEntityMappingService:SaveQuotePageToEntityMappingService, private cislService:CislService){}  
    @Output() SaveQuote = new EventEmitter();
    @Output() CloseSavePopup = new EventEmitter();
    
    public showSaveEmailConsentPopup:boolean = false;
    public showSaveConfirmPopup:boolean = false;
    public saveQuote:any;
    public currentPageId:number;
    public allPageData = {};
    public isSaveConsentAccepted:boolean = false;
    public previousSavedData = {};
    private applicationData:any;
    public isFromEmailPhonePopup:boolean = false;
    public isBuyNowClicked:boolean = false;

    private getApplicationSessionData(){
        this.applicationData = JSON.parse(sessionStorage.getItem('Application'));
        if(this.applicationData.isSaveQuote || (this.applicationData.emailConsentAccepted && this.applicationData.owner.email !== "")){
            this.isSaveConsentAccepted = true;
        }
    }

    public openSaveQuotePopup():void{
        this.getApplicationSessionData();
        if(!this.isSaveConsentAccepted ){
            this.showSaveEmailConsentPopup = true;
        } else {
            this.showSaveConfirmPopup = true;
            this.setPageDataToSave();
        }
    }

    public closeSaveQuotePopup():void{
        this.showSaveEmailConsentPopup = false;        
        this.CloseSavePopup.emit();
    }

    public closeSaveOkPopup(){
        this.showSaveConfirmPopup = false;
        this.CloseSavePopup.emit();
    }

    public setPageDataToSave():void{
        this.isSaveConsentAccepted = true;
        this.showSaveConfirmPopup = true;
        this.closeSaveQuotePopup();
        this.previousSavedData = this.getPageDataFromSession();
        this.SaveQuote.emit();
        this.allPageData = this.getPageDataFromSession();      
        this.saveDataOnChange();
    }

    public autoSavePageData(){
        this.previousSavedData = this.getPageDataFromSession();
        this.SaveQuote.emit();
        this.allPageData = this.getPageDataFromSession();      
        this.saveDataOnChange();
    }

    private saveDataOnChange(){
        if(JSON.stringify(this.previousSavedData) == JSON.stringify(this.allPageData) && !this.isFromEmailPhonePopup){
            return;
        } else {
            this.isFromEmailPhonePopup = false;
            this.postDataToSave();
        }
    }

    private postDataToSave(){       
        let dataToSave = this._SaveQuotePageToEntityMappingService.getEntityDataToSave(this.allPageData, this.currentPageId, this.isBuyNowClicked);        
        this.cislService.saveQuotation(dataToSave).subscribe(data => { this.saveQuotationSuccess(data) });

    }

    private saveQuotationSuccess(data){
        console.log('data saved successfully' + data);
    }
    
    public getPageDataFromSession(){
        let pageData = {}
        for (let i = 0; i < sessionStorage.length; i++){
            //TODO: this is really dirty!!! Why iterating over all session storage??
            if (sessionStorage.key(i) == 'qb_jwt' || sessionStorage.key(i) == "channel" || sessionStorage.key(i) == "qb_ticket"
                || sessionStorage.key(i) == "cc_origip" || sessionStorage.key(i) == "qb_sessionid" || sessionStorage.key(i) == "qb_uname") {
                continue;
            }
           let sessionData = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
           pageData[sessionStorage.key(i)] = sessionData;            
        }
        
        return pageData;        
    }
}