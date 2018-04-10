import { Component,OnInit, Output,ViewChild } from '@angular/core';
import { SaveQuoteService } from './../quote.save.service';
import { CislService } from '../../util/util.cisl.service';
import { MarketingConsentsComponent } from '../../commons/marketingconsents/marketing.consents.component';
import { AEMSet, AEMTrack } from '../../commons/analytics';
@Component({
    selector: 'save-email-consent-pop-up',
    templateUrl: './save.email.consent.popup.html'
})

export class SaveEmailConsentPopup implements OnInit {   
    @ViewChild('consentComp') consentComp:MarketingConsentsComponent;
    public consentsId = 'AZONLINE_QUOTATIONSAVE';
    public consentsArr = [];
    public selectedAllConsent: boolean = false;
    public questionCatelogueId: String = '';
    public isMarketingConsentChecked: boolean = true;
    public contractId: string = '';
    public enabledSave:boolean = true;
    public isEmailValid:boolean = true;
    public email:string = '';
    public isPhoneValid:boolean = true;
    public quotationNumber:string = "12355";
    public isEmailBlank:boolean = false;
    public phone:string = '';
    public errorAcceptConsents:boolean = false;
    public applicationData:any;
    public pageId:string = "SavePopup";
    public phoneConsentAccepted:boolean = false;
    public emailConsentAccepted:boolean = false;
    public saveClicked:boolean = false;   


    constructor(private _saveQuoteService:SaveQuoteService,private cislService: CislService){}   
    ngOnInit(){
        this.applicationData = JSON.parse(sessionStorage.getItem("Application"));        
        if(this.applicationData != null){
            this.contractId = this.applicationData.contractId;
            this.quotationNumber = this.applicationData.quoteId;
            this.phoneConsentAccepted = this.applicationData.phoneConsentAccepted;
            this.emailConsentAccepted = this.applicationData.emailConsentAccepted;
            if(this.applicationData.owner !== undefined){
                this.email = this.applicationData.owner.email;
                this.phone = this.applicationData.owner.phone;
            }
        }
        this.getMarketingConsentsFromCisl();
    }    
    hideEmailConsentPopup(){       
        this._saveQuoteService.closeSaveQuotePopup();
    }
    
    emailValidation(){
        if(this.email == ''){
            this.isEmailBlank = true;
        } else {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.isEmailValid = re.test(this.email); 
        this.isEmailBlank = false;  
        }
    }

    removeMailError(){
        this.isEmailValid = true;
        this.isEmailBlank = false; 
    }

    removeSpace(event) {
        let k = event.charCode;
        if (k == 32) {
          return false;
        }
    }

    acceptNumbersAndPlus(event){
        let k = event.charCode;
        let val = false; 
        this.isPhoneValid = true;   
        if (k >= 48 && k <= 57 || k == 43 || k == 0 || k >= 128) {
          return
        } else {
          return val;
        }
      }
    
    phoneValiation() {
        let re = /^(\+?\d+)$/g;
        let val = this.phone;
        if (val !== '') {
            this.consentsArr[1].subQuestions[0].answerObligationType = "mandatory";
            this.isPhoneValid = re.test(val);
        } else {
            this.consentsArr[1].subQuestions[0].answerObligationType = "optional";
            this.isPhoneValid = true;
        }

        if (this.isPhoneValid) {
            if (val.length < 9 && val.length !== 0) {
                this.isPhoneValid = false;
            }
        }
        this.consentComp.checkMandatoryConsents();
    }

    saveConfirm(){
        this.saveClicked = true;
        this.validateMandatory();
        if(this.isEmailValid && this.selectedAllConsent && !this.isEmailBlank && this.isPhoneValid){            
            this.sendMarketingConsentToCisl();
            this.applicationData.isSaveQuote = true;
            this.saveDataToSession();
            this._saveQuoteService.isFromEmailPhonePopup = true;
            this._saveQuoteService.setPageDataToSave();
        } else {
            this.saveDataToSession();
        }
       
        	/* ********************DO-NOT-TOUCH***************************************** */
             console.log("####savecliked####"+this.saveClicked);
		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.saveQuote', this.saveClicked);
               AEMTrack('saveQuote');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */


    }

    saveDataToSession(){
        let ownerContacts = {
            "email": this.email,
            "phone": this.phone
        }
        this.applicationData.owner = ownerContacts;
        this.applicationData.emailConsentAccepted = this.emailConsentAccepted;
        this.applicationData.phoneConsentAccepted = this.phoneConsentAccepted;
        this.applicationData.saveConsents = this.consentsArr;        
        sessionStorage.setItem("Application", JSON.stringify(this.applicationData));
    }

    validateMandatory(){
        /* Email Validation */
        if(this.email == ''){
            this.isEmailBlank = true;
        } else {
            this.isEmailBlank = false;
            this.emailValidation();
        }

         /* Phone Validation */
        this.phoneValiation();

        /* Consent validation */
        if(!this.selectedAllConsent){
            if(this.phone !== '' && this.consentsArr[1].subQuestions[0].answer.value == false ){
                this.errorAcceptConsents = true;
                this.selectedAllConsent = false;
                this.phoneConsentAccepted = false;
            } else if(this.consentsArr[1].subQuestions[1].answer.value == false ){
                this.errorAcceptConsents = true;
                this.selectedAllConsent = false;
                this.emailConsentAccepted = false;
            } else {
                this.errorAcceptConsents = false;
                this.selectedAllConsent = true;
            }           
        } else {
            this.errorAcceptConsents = false;
        }

        if(this.consentsArr[1].subQuestions[0].answer.value == true){
            this.phoneConsentAccepted = true;
        } 
        if(this.consentsArr[1].subQuestions[1].answer.value == true ){
            this.emailConsentAccepted = true;
        }
    }

    	/* Marketing consents */
	getMarketingConsentsFromCisl() {
		this.cislService.getMarketingConsentsFromCisl(this.contractId, this.consentsId).subscribe(data => { this.serializeMarketingConsents(data) });
	}
	serializeMarketingConsents(data) {
		this.questionCatelogueId = data[0].questionsCatalogueId;
        this.consentsArr = data[0].decisionQuestion;
        this.consentsArr[1].subQuestions[0].answerObligationType = "optional";
	}
	serializePutMarketingConsents(data) { }
	setConsents(data) {           
		this.isMarketingConsentChecked = !(data.IsConsentValid);
		this.selectedAllConsent = data.SelectedAllConsents;
        this.consentsArr = data.ConsentArray;
             
	}
	sendMarketingConsentToCisl() {
		this.cislService.sendMarketingConsentsToCisl(this.contractId, this.questionCatelogueId, this.consentsArr).subscribe(data => { this.serializePutMarketingConsents(data) });
	}
}
