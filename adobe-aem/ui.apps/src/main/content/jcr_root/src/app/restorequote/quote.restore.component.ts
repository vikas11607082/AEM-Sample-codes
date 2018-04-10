import { Component, Renderer, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ErrorPopUp } from '../commons/popup/popup.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CallPopUp } from '../commons/popup/callcenterpopup.component';
import { RestoreQuoteSessionService } from './quote.restore.session';
import { CislService } from './../util/util.cisl.service';
import { Constants } from '../commons/constants';

@Component({
  templateUrl: './quote.restore.component.html',
  entryComponents: [ErrorPopUp, CallPopUp]
})
export class RestoreQuoteComponent extends Constants implements OnInit {
  constructor(private restoreSession: RestoreQuoteSessionService, private activeRoute: ActivatedRoute, private router:Router, private cislService: CislService) {super(); }
  public quoteId: String = "";
  public email: String = "";
  public quotationRef:string = "";
  private pageNumber: any;
  private pageIdRoute = {
    1 : "/cardetails",
    2 : "/carusage",
    3 : "/carownerdetails",
    4 : "/driverdetails",
    5 : "/productbundle",
    6 : "/configuration"
  };
  public showSecurityQuestionPopup:boolean = false;
  public showOfferUnpaidPopup:boolean = false;
  public showOfferResendPopup:boolean = false;
  public showQuoteExpiredPopup:boolean = false;
  public showPriceRecalculationPopup:boolean = false;
  private quoteStatus:string = "OFFER";
  private lastSavePage = 2;
  public ticketId = "";
  public userNameCC = "";
  
  ngOnInit() {
    sessionStorage.clear();
    this.activeRoute.queryParams.subscribe(queryParam => { this.ticketId = queryParam["ticket"], this.userNameCC = queryParam["uname"], this.quoteId = queryParam["quoteId"], this.email = queryParam["email"], this.quotationRef = queryParam["quotationRef"] });
    sessionStorage.setItem("qb_uname",this.userNameCC);
    sessionStorage.setItem("qb_ticket",this.ticketId);
    this.retrieveAsPerChannel();    
  }
  serializeAuthData(data){
    this.cislService.getDataForCallCenterRetrieve(this.quoteId, this.email).subscribe(data => { this.serializeRetrieveData(data); });    
  }

  /* API calls according to request from channel i.e. from CC or email link retrieval  */
  private retrieveAsPerChannel(){
    if(this.quotationRef !== undefined){
      this.cislService.validateQuoteRetrieveEmail(this.quotationRef).subscribe(data => {this.showSecurityQuestions(data)})
    } else {
      this.cislService.checkLoggedIn(this.ticketId).subscribe(data => { this.serializeAuthData(data) }, err => { this.serializeErr(err); });      
    }
  }
  serializeErr(err) {
        if(err.error.errorCode == this.ERR_SSO){
            location.assign("/cclogin");
        }else if(err.error.errorCode == this.ERR_ACCESS_DENIED){
            sessionStorage.clear();
            this.router.navigate(["/unauthoriseduser"]);
        }        
    }
  private showSecurityQuestions(data){
    if(data.validQuote){
      this.lastSavePage = data.savedPageNo;
      this.quoteId = data.quoteId;
      this.email = data.email;
      this.showSecurityQuestionPopup = true;
    } else {
      this.showQuoteExpiredPopup = true;
    }    
  }

  private serializeRetrieveData(data) {
    if(data.quote.savedPageNo == 9 || data.quote.quoteStatus == this.quoteStatus){
      this.showSecurityQuestionPopup = false;
      this.showQuoteExpiredPopup = true;
      return;
    }
    this.restoreSession.isPremiumChanged = data.quote.configurationChanged;   
    this.pageNumber = this.restoreSession.setPagesSessionData(data);
    this.navigateToPage();
  }


  /* Calls from Offer Unpaid popup */
  public sendOfferAgain(event){   
    this.showOfferUnpaidPopup = false;
    this.showOfferResendPopup = true;
  }

  public navigateToThankYou(event){
    this.showOfferUnpaidPopup = false;
    this.showOfferResendPopup = false;
    this.router.navigateByUrl("/thankyou");
  }

  /* Navigate to last saved page */
  private navigateToPage() {
    this.showSecurityQuestionPopup = false;
    if(this.quotationRef == undefined){
      this.router.navigateByUrl(this.pageIdRoute[1]);
    } else if (this.pageNumber >= 6 && this.pageNumber <= 8) {
      this.router.navigateByUrl(this.pageIdRoute[6]);
    } else {
      this.router.navigateByUrl(this.pageIdRoute[this.pageNumber]);
    }
  }

  public loadNewQuote(event){
    sessionStorage.clear();
    this.router.navigateByUrl(this.pageIdRoute[1]);
  }

  public closeRecalculatePopup(event){
    this.showPriceRecalculationPopup = false;
  }
}