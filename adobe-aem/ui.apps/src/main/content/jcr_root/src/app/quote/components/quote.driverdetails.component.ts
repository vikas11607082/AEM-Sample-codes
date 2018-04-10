import { Component, Renderer, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { CislService } from '../../util/util.cisl.service';
import { Router } from '@angular/router';
import { ErrorPopUp } from '../../commons/popup/popup.component';
import { CallPopUp } from '../../commons/popup/callcenterpopup.component';
import { CamelCaseConvert } from '../../util/title.camel.case.service';
import { SaveQuoteService } from '../../savequote/quote.save.service';
import { SaveButtonHideShowService } from '../../savequote/save.button.hide.show.service';
import { AEMSet, AEMTrack,AEMClearVars } from '../../commons/analytics';


declare var window: any;
@Component({
  templateUrl: '../html/quote.driverdetails.component.html',
  entryComponents: [ErrorPopUp, CallPopUp]
})
export class DriverDetailsComponent implements OnInit {

  @ViewChild('driverFirstName') driverFirstName: ElementRef
  @ViewChild('driverSurname') driverSurname: ElementRef
  @ViewChild('driverPesel') driverPesel: ElementRef
  @ViewChild('driverFamilyName') driverFamilyName: ElementRef
  @ViewChild('driverRegOn') driverRegOn: ElementRef
  @ViewChild('dropDownMM') dropDownMM: ElementRef
  @ViewChild('dropDownDD') dropDownDD: ElementRef
  @ViewChild('dropDownYY') dropDownYY: ElementRef
  //@ViewChild('discOptions') discOptions: ElementRef

  constructor(private cislService: CislService, private router: Router, private titleConvert: CamelCaseConvert, 
              private saveQuoteService:SaveQuoteService, private _saveButtonShowHide:SaveButtonHideShowService) { }
  dateEntered:boolean=true;
  hasErrors:boolean=false;
  nextClicked:boolean= false;
  selectedAll: any;
  public driverKid: boolean = false;
  mainOwnerData: any;
  coOwnerData: any;
  coOwner2Data: any;
  showMainOwnerData: any;
  showCoOwnerData: boolean = false;
  showCoOwner2Data: boolean = false;
  driverTypeMainOwner: string = "";
  driverTypeCoOwner: string = "";
  driverTypeCoOwner2: string = "";
  otherDriverSel: boolean = false;
  isDriverWoman: boolean = false;
  minimumYear: string = '';
  maximumYear: string = (new Date().getFullYear) + '';
  dateOfIssueDL: string = '';
  hasDriverKids: any;
  minimumYearKid: string = '';
  maximumYearKid: string = '';
  prevDriverPartyId: string = '';
  driverKidBirthYear: string = 'Wybierz'; //Todo after translation problem is resolved  en:  choose
  monthsDD = [];
  datesDD = [];
  yearsDD = [];
  daySelected: any = 'Dzień';
  monthSelected: any = 'Miesiąc';
  yearSelected: any = 'Rok';
  showDriverDetails: boolean = false;
  discountOptions = ['15% for purchase on the web', '20% for purchase on the web', '30% for purchase on the web'];
  selectedDiscountOpt = "15% for purchase on the web";
  public monthsToDisplay = [];
  public yearsToDisplay = [];
  driverOtherOptionSel: boolean = false;
  driverData = {
    "firstName": '',
    "surName": '',
    "pesel": '',
    "familyName": '',
    "regOn": '',
    "type": '',
    "partyId": '',
    "roleId": '',
    "emailChannelId": '',
    "phoneChannelId": '',
    "docsId": ''
  };
  public isMarried: boolean;
  public yearList: Array<String> = [];
  public kidYearList: Array<String> = [];

  public email: string = '';
  public isEmailValid: boolean = true;
  public phone: string = '';
  public isPhoneValid: boolean = true;

  public disabledNext: boolean = false;
  public driverKidSelected: boolean;
  public selectedDriver: String = "";

  public driverPageData: any;

  public drivingLicenceYearPlaceholder: string = 'Wybierz'; //Todo after translation problem is resolved  en:  choose
  public kidBirthYearPlaceholder: string = 'Wybierz'; //Todo after translation problem is resolved  en:  choose
  public policyDatePlaceholder: string = "Dzień";
  public policyMonthPlaceholder: string = "Miesiąc";
  public policyYearPlaceholder: string = "Rok";
  public ownerData: any;
  public showPeselErr: boolean = false;
  public isEmailPhone: boolean = false;
  public isEmailPhoneDriverPage: boolean = false;

  public carDetailsData: any;
  public carUsageData: any;

  public event: any;

  public consentsArr = [];
  public selectedAllConsent: boolean;
  public isMarketingConsentChecked: boolean = true;
  public consentsId = 'AZONLINE_DRIVERDETAILS';
  public questionCatelogueId: String = '';
  public monthFlag: boolean = false;
  public applicationData: any;

  private currentPageId = 4;

  validPesel:boolean=true;
  errorPesel:string='';


  ngOnInit() {

    /*code to get current pageName and pageID and send it to adobe analytics*/

       var path = window.location.href;
       var pageData=path.split("#/");
       console.log("PAge data "+pageData);
       var currentPageName=pageData[1];
       console.log(currentPageName);
     

     if (currentPageName=="driverdetails")
    {
	   var pageName= "Driver's details";
     var pageID="car/S4driverDetail:Step4";
    
   	 		/* ********************DO-NOT-TOUCH***************************************** */
         /* Clear eVars variables from the data layer on change of page view */
			 
			 AEMClearVars();

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.spapageview', pageName);
               AEMTrack('spapageview');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */
     } //end if condition
  
	 /*code to get current pageName and pageID and send it to adobe analytics end here*/



    this.carDetailsData = JSON.parse(sessionStorage.getItem("carDetails"));
    this.carUsageData = JSON.parse(sessionStorage.getItem("carusage"));
    // this.mainOwnerData = JSON.parse(sessionStorage.getItem("carOwner"));
    // this.coOwnerData = JSON.parse(sessionStorage.getItem("carCoOwner"));
    // this.coOwner2Data = JSON.parse(sessionStorage.getItem("carCoOwner2"));
    this.driverPageData = JSON.parse(sessionStorage.getItem("driverData"));
    this.ownerData = JSON.parse(sessionStorage.getItem("ownerData"));
    this.applicationData = JSON.parse(sessionStorage.getItem('Application'));

    if (this.ownerData.ownerDetails.length >= 1) {
      this.mainOwnerData = this.ownerData.ownerDetails[0];
    }
    if (this.ownerData.ownerDetails.length >= 2) {
      this.coOwnerData = this.ownerData.ownerDetails[1];
    }
    if (this.ownerData.ownerDetails.length == 3) {
      this.coOwner2Data = this.ownerData.ownerDetails[2];
    }

    this._saveButtonShowHide.showQuoteId();
    this._saveButtonShowHide.showSaveButton();

    if (this.ownerData) {
      if (this.applicationData.contractId == undefined) {
        this.applicationData.contractId = this.applicationData.contractId;
      }
      if (this.ownerData.propertyId == undefined) {
        this.ownerData.propertyId = this.applicationData.propertyId;
      }
    }
    if (this.mainOwnerData != null) {
      if (this.mainOwnerData.type == 'PrivatePerson') {
        this.driverTypeMainOwner = 'PP';
        this.showMainOwnerData = true;
      } else if (this.mainOwnerData.type == 'SoleTrader') {
        this.driverTypeMainOwner = 'ST';
        this.showMainOwnerData = true;
      }
      this.email = this.applicationData.owner.email;
      this.phone = this.applicationData.owner.phone;
      this.driverData.emailChannelId = this.applicationData.owner.emailChannelId;
      this.driverData.phoneChannelId = this.applicationData.owner.phoneChannelId;
      if (this.email == '' || this.phone == '') {
        this.isEmailPhone = true;
        this.isEmailPhoneDriverPage = true;
      } else {
        this.isEmailPhone = false;
      }
    }
    if (this.coOwnerData != null) {
      if (this.coOwnerData.type == 'PrivatePerson') {
        this.driverTypeCoOwner = 'PP';
        this.showCoOwnerData = true;
      } else if (this.coOwnerData.type == 'SoleTrader') {
        this.driverTypeCoOwner = 'ST';
        this.showCoOwnerData = true;
      }
    }
    if (this.coOwner2Data != null) {
      if (this.coOwner2Data.type == 'PrivatePerson') {
        this.driverTypeCoOwner2 = 'PP';
        this.showCoOwner2Data = true;
      } else if (this.coOwner2Data.type == 'SoleTrader') {
        this.driverTypeCoOwner2 = 'ST';
        this.showCoOwner2Data = true;
      }
    }

    if (this.driverPageData != null) {
      if (this.driverPageData.driver !== "") {
        this.showDriverDetails = true;
        this.selectedDriver = this.driverPageData.driver;
        if (this.driverPageData.driver == "other") {
          this.driverData.firstName = this.driverPageData.driverFirstname;
          this.driverData.surName = this.driverPageData.driverSurName;
          this.driverData.familyName = this.driverPageData.driverFamilyName;
          this.driverData.pesel = this.driverPageData.driverPesel;

          this.getBirthYear(this.driverData.pesel);
          this.showDriverDetails = true;
          this.otherDriverSel = true;
        }
        this.driverData.partyId = this.driverPageData.partyId;
        this.driverData.roleId = this.driverPageData.roleId;
        this.driverData.regOn = this.driverPageData.driverRegon;
        this.drivingLicenceYearPlaceholder = this.driverPageData.driverLicenceDate;
        this.dateOfIssueDL = this.driverPageData.driverLicenceDate;
        this.isMarried = this.driverPageData.driverMarried;
        this.driverKidSelected = this.driverPageData.driverHasKids;
        if (this.driverKidSelected) {
          this.selectDriverKidsY();
        }
        this.kidBirthYearPlaceholder = this.driverPageData.driverKidBirthYear ? this.driverPageData.driverKidBirthYear : "Wybierz";
        this.driverKidBirthYear = this.driverPageData.driverKidBirthYear ? this.driverPageData.driverKidBirthYear : "Wybierz";
        /*Analytics tracking for  driver kid age year selection*/
        // if (window && window.om.core.tracking.addSPAEvent) {
        //   window.om.core.tracking.addSPAEvent("driverkidage", "click", { "driverkidage": this.driverKidBirthYear }); // add event to the datalayer
        //   window._satellite.track("driverkidage"); // trigger dynamic tag manager
        // }
        /*Analytics tracking for driver kid age year selection end */

        this.policyDatePlaceholder = this.driverPageData.policyStartDate;
        this.daySelected = this.driverPageData.policyStartDate;
        this.policyMonthPlaceholder = this.driverPageData.policyStartMonth;
        this.monthSelected = this.driverPageData.policyStartMonth;
        this.policyYearPlaceholder = this.driverPageData.policyStartYear;
        this.yearSelected = this.driverPageData.policyStartYear;

        this.selectedAllConsent = this.driverPageData.selectedAllConsent;
        this.consentsArr = this.driverPageData.consent;
        this.questionCatelogueId = this.driverPageData.questionCatelogueId,
        this.driverData.emailChannelId = this.applicationData.owner.emailChannelId;
        this.driverData.phoneChannelId = this.applicationData.owner.phoneChannelId;
        this.driverData.docsId = this.driverPageData.identificationDocumentId;
        this.isEmailPhoneDriverPage = this.driverPageData.isEmailPhoneDriverPage;
        this.isEmailPhone = this.isEmailPhoneDriverPage ? this.isEmailPhoneDriverPage : this.isEmailPhone;
        //For Radio on UI
        this.hasDriverKids = String(this.driverKidSelected);


        if (this.driverPageData.driver == "mainOwner" && this.mainOwnerData) {
          this.selectMainOwner();
        } else if (this.driverPageData.driver == "coOwner" && this.coOwnerData) {
          this.selectCoOwner();
        } else if (this.driverPageData.driver == "coOwner2" && this.coOwner2Data) {
          this.selectCoOwner2();
        }
      }
      if(this.driverPageData.consent.length <= 0 ){
        this.getMarketingConsentsFromCisl();
      }
    } else {
      this.getMarketingConsentsFromCisl();
    }

    // Only For Bank,Leasing,Company Other Option in showing
    if (!this.showMainOwnerData && !this.showCoOwnerData && !this.showCoOwner2Data) {
      this.otherDriverSel = true;
      this.driverOtherOptionSel = true;
      this.selectedDriver = 'other';
      this.selectOtherDriver();
    }
    this.populateCalendarDD();
    this.validateMandatoryFields(this.event);


    /* Save Quote Listener function*/
    this.addSaveQuoteListener();

  }

  private addSaveQuoteListener(): void {
    this.saveQuoteService.currentPageId = this.currentPageId;
    this.saveQuoteService.SaveQuote.subscribe(() => {
      if (this.saveQuoteService.currentPageId == this.currentPageId) {
        if (this.saveQuoteService.isFromEmailPhonePopup) {
          this.applicationData = JSON.parse(sessionStorage.getItem('Application'));
          if (this.applicationData.owner) {
            this.email = this.applicationData.owner.email;
            this.phone = this.applicationData.owner.phone;
          }
        }
        this.savePageData();
      }

    });
  }
  validatePeselKeyup(event){
    var pesel = event.target.value;
    if(pesel.length == 11){
      this.validPesel = this.isPeselValid(pesel);
    }else {
      this.validPesel = true;
    }
    this.errorPesel = 'dataInvalid';    
  }
  validatePeselBlur(event){
    var pesel = event.target.value;
    if(pesel != ''){
      this.validPesel = this.isPeselValid(pesel);
    }else {
      this.validPesel = true;
    }    
    this.errorPesel = 'dataInvalid';
  }
  clearPlaceHolderInput() {
    this.driverFirstName.nativeElement.classList.add('is-filled');
    this.driverSurname.nativeElement.classList.add('is-filled');
    this.driverPesel.nativeElement.classList.add('is-filled');
    if (this.driverFamilyName != undefined) {
      this.driverFamilyName.nativeElement.classList.add('is-filled');
    }
    if (this.driverRegOn != undefined) {
      this.driverRegOn.nativeElement.classList.add('is-filled');
    }
  }
  resetPlaceHolderInput() {
    this.driverFirstName.nativeElement.classList.remove('is-filled');
    this.driverSurname.nativeElement.classList.remove('is-filled');
    this.driverPesel.nativeElement.classList.remove('is-filled');
    if (this.driverFamilyName != undefined) {
      this.driverFamilyName.nativeElement.classList.remove('is-filled');
    }
    if (this.driverRegOn != undefined) {
      this.driverRegOn.nativeElement.classList.remove('is-filled');
    }
  }
  selectMainOwner() {
    this.clearPlaceHolderInput();
    if (this.driverTypeMainOwner == 'PP') {
      this.driverData.firstName = this.mainOwnerData.firstName;
      this.driverData.surName = this.mainOwnerData.surName;
      this.driverData.pesel = this.mainOwnerData.peselId;
      this.driverData.familyName = this.mainOwnerData.familyName;
      this.driverData.regOn = '';
      this.driverData.type = "PP"
    } else {
      this.driverData.firstName = this.mainOwnerData.firstName;
      this.driverData.surName = this.mainOwnerData.surName;
      this.driverData.pesel = this.mainOwnerData.peselId;
      this.driverData.familyName = this.mainOwnerData.familyName;
      this.driverData.regOn = this.mainOwnerData.regOn;
      this.driverData.type = "ST"
    }
    this.getBirthYear(this.driverData.pesel);
    this.showDriverDetails = true;
    this.otherDriverSel = false;
  }
  selectCoOwner() {
    this.clearPlaceHolderInput();
    if (this.driverTypeCoOwner == 'PP') {
      this.driverData.firstName = this.coOwnerData.firstName;
      this.driverData.surName = this.coOwnerData.surName;
      this.driverData.pesel = this.coOwnerData.peselId;
      this.driverData.familyName = this.coOwnerData.familyName;
      this.driverData.regOn = '';
      this.driverData.type = "PP"
    } else {
      this.driverData.firstName = this.coOwnerData.firstName;
      this.driverData.surName = this.coOwnerData.surName;
      this.driverData.pesel = this.coOwnerData.peselId;
      this.driverData.familyName = this.coOwnerData.familyName;
      this.driverData.regOn = this.coOwnerData.regOn;
      this.driverData.type = "ST"
    }
    this.getBirthYear(this.driverData.pesel);
    this.showDriverDetails = true;
    this.otherDriverSel = false;
  }
  selectCoOwner2() {
    this.clearPlaceHolderInput();
    if (this.driverTypeCoOwner2 == 'PP') {
      this.driverData.firstName = this.coOwner2Data.firstName;
      this.driverData.surName = this.coOwner2Data.surName;
      this.driverData.pesel = this.coOwner2Data.peselId;
      this.driverData.familyName = this.coOwner2Data.familyName;
      this.driverData.regOn = '';
      this.driverData.type = "PP"
    } else {
      this.driverData.firstName = this.coOwner2Data.firstName;
      this.driverData.surName = this.coOwner2Data.surName;
      this.driverData.pesel = this.coOwner2Data.peselId;
      this.driverData.familyName = this.coOwner2Data.familyName;
      this.driverData.regOn = this.coOwner2Data.regOn;
      this.driverData.type = "ST"
    }
    this.getBirthYear(this.driverData.pesel);
    this.showDriverDetails = true;
    this.otherDriverSel = false;
  }
  selectOtherDriver() {
    this.resetPlaceHolderInput();
    this.driverData.firstName = '';
    this.driverData.surName = '';
    this.driverData.familyName = '';
    this.driverData.pesel = '';
    this.driverData.regOn = '';
    this.otherDriverSel = true;
    this.showDriverDetails = true;
    this.isDriverWoman = false;
    this.yearList = [];
    this.drivingLicenceYearPlaceholder = 'Wybierz'; //Todo after translation problem is resolved  en:  choose
  }
  selectLicenseIssueDate(date: any) {
    this.dateOfIssueDL = date;
    this.drivingLicenceYearPlaceholder = this.dateOfIssueDL;
    this.validateMandatoryFields(this.event);


        

    
      	 		/* ********************DO-NOT-TOUCH***************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.quoteData.carDriverDetails.driverLicenseIssueYear', date);
             
		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */

  }
  selectDateDD(dd: any) {
    this.daySelected = dd;
    this.policyDatePlaceholder = this.daySelected;
    this.assignMonthValues();
    this.validateMandatoryFields(this.event);
  }
  selectMonthDD(mm: any) {
    this.monthSelected = mm;
    this.policyMonthPlaceholder = mm;
    this.assignYearValues();
    this.validateMandatoryFields(this.event);
  }
  selectYearDD(yyyy: any) {
    this.yearSelected = yyyy;
    this.policyYearPlaceholder = yyyy;
    this.validateMandatoryFields(this.event);
  }
  populateCalendarDD() {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();

    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    this.yearsToDisplay.push(currentYear);
    this.monthsToDisplay.push(currentMonth + 1);

    let daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    if (currentMonth == 1) {
      daysInMonth = 30;
    }
    for (var i = 0; i < daysInMonth; i++) {
      var day = new Date(year, month, date + i);
      this.datesDD.push(day.getDate());
      if (currentMonth !== day.getMonth()) {
        this.monthsToDisplay.push(day.getMonth() + 1);
        currentMonth = day.getMonth();
      }

      if (currentYear !== day.getFullYear()) {
        this.yearsToDisplay.push(day.getFullYear());
        currentYear = day.getFullYear();
      }
    }
  }

  assignYearValues() {
    let date = new Date();
    let todaysDate = date.getDate();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();
    this.yearsDD = [];

    if (currentMonth == 11) {
      if (this.monthSelected < currentMonth) {
        this.yearsDD.push(this.yearsToDisplay[1]);
        this.assignYearPlaceHolder();
      } else {
        this.yearsDD.push(this.yearsToDisplay[0]);
        this.assignYearPlaceHolder();
      }
    } else {
      this.yearsDD.push(this.yearsToDisplay[0]);
      this.assignYearPlaceHolder();
    }
  }

  assignYearPlaceHolder() {
    if (this.policyYearPlaceholder !== this.yearsDD[0]) {
      this.policyYearPlaceholder = 'Rok';
      this.yearSelected = '';
    }
  }
  assignMonthValues() {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let todaysDate = date.getDate();
    let counter = 0;
    this.monthsDD = [];
    for(let i=0; i<this.datesDD.length; i++){
      if(this.daySelected == this.datesDD[i]){
        counter++;
      }
    }

    if (counter == 2) {
      this.monthsDD.push(this.monthsToDisplay[0]);
      this.monthsDD.push(this.monthsToDisplay[1]);
    } else if (counter == 1) {
      if (this.daySelected < todaysDate) {
        this.monthsDD.push(this.monthsToDisplay[1]);
        if(this.policyMonthPlaceholder !== this.monthsDD[0]){
          this.policyMonthPlaceholder = "Miesiąc";
          this.monthSelected = '';
        }
      } else if (this.daySelected >= todaysDate && this.daySelected <= lastDay) {
        this.monthsDD.push(this.monthsToDisplay[0]);
        if (this.policyMonthPlaceholder !== this.monthsDD[0]) {
          this.policyMonthPlaceholder = "Miesiąc";
          this.monthSelected = '';
        }
      } else {
        this.policyMonthPlaceholder = "Miesiąc";
        this.monthSelected = '';
      }
    }
    
  }
  hideMonthDD() {
    this.dropDownMM.nativeElement.classList.remove("is-visible");
    this.dropDownMM.nativeElement.classList.add("is-not-visible");
  }
  hideDateDD() {
    this.dropDownDD.nativeElement.classList.remove("is-visible");
    this.dropDownDD.nativeElement.classList.add("is-not-visible");
  }
  hideYearDD() {
    this.dropDownYY.nativeElement.classList.remove("is-visible");
    this.dropDownYY.nativeElement.classList.add("is-not-visible");
  }
  // showDiscountOptions() {
  //   this.discOptions.nativeElement.style.visibility = "visible";
  //   this.discOptions.nativeElement.classList.remove("is-not-visible");
  //   this.discOptions.nativeElement.classList.add("is-visible");
  // }
  // selectDiscountOption(data: any) {
  //   this.selectedDiscountOpt = data;
  //   this.discOptions.nativeElement.classList.remove("is-visible");
  //   this.discOptions.nativeElement.classList.add("is-not-visible");
  //    this.discOptions.nativeElement.style.visibility = "hidden";
  //   event.stopPropagation();
  // }
  // hideDDDiscountOptions() {
  //   this.discOptions.nativeElement.classList.remove("is-visible");
  //   this.discOptions.nativeElement.classList.add("is-not-visible");
  //   this.discOptions.nativeElement.style.visibility = "hidden";
  // }
  checkPesel(event) {
    let val: string = event.target.value;
    let str = val.slice(9, 10);
    let length = val.length;

    this.yearList = [];
    if (this.isPeselValid(val)) {
      this.getBirthYear(val);
    }

    if (length >= 10) {
      if (str == "0" || str == "2" || str == "4" || str == "6" || str == "8") {
        this.isDriverWoman = true;
        return;
      } else {
        this.isDriverWoman = false;
        this.driverData.familyName = '';
      }
    } else {
      this.isDriverWoman = false;
      this.driverData.familyName = '';
    }
    this.checkDuplicatePesel();
    event.preventDefault();
  }


  selectDriverKidsY() {
    this.driverKidSelected = true;
    var currDate = new Date();
    var currYear = currDate.getFullYear();
    this.minimumYearKid = (currYear - 26) + '';
    this.maximumYearKid = currYear + '';
    this.kidYearList = this.createYearList(this.maximumYearKid, this.minimumYearKid);
    this.validateMandatoryFields(this.event);
  }
  selectDriverKidsN() {
    this.driverKidSelected = false;
    this.driverKidBirthYear = '';
    this.validateMandatoryFields(this.event);
  }
  selectKidBirthYear(date: any) {    
    this.driverKidBirthYear = date;
    this.kidBirthYearPlaceholder = date;
    this.trackdriverkid(date);
    this.validateMandatoryFields(this.event);
  }
  showDropDownDD(dropDownDD: any) {
    dropDownDD.classList.remove("is-not-visible");
    dropDownDD.classList.add("is-visible");
  }
  showDropDownMM(dropDownMM: any) {
    dropDownMM.classList.remove("is-not-visible");
    dropDownMM.classList.add("is-visible");
  }
  showDropDownYY(dropDownYY: any) {
    dropDownYY.classList.remove("is-not-visible");
    dropDownYY.classList.add("is-visible");
  }
  getBirthYear(peselId) {
    var PESEL = [];
    for (var i = 0; i < peselId.length; i++) {
      PESEL[i] = peselId.substring(i, i + 1);
    }
    var year;
    var month;
    year = 10 * PESEL[0];
    year = parseInt(year) + parseInt(PESEL[1]);
    month = 10 * PESEL[2];
    month = parseInt(month) + parseInt(PESEL[3]);
    if (month > 80 && month < 93) {
      year += 1800;
    }
    else if (month > 0 && month < 13) {
      year = parseInt(year) + 1900;
    }
    else if (month > 20 && month < 33) {
      year = parseInt(year) + 2000;
    }
    else if (month > 40 && month < 53) {
      year = parseInt(year) + 2100;
    }
    else if (month > 60 && month < 73) {
      year = parseInt(year) + 2200;
    }
    this.minimumYear = (parseInt(year) + 16) < (parseInt(this.maximumYear) - 35) ? ((parseInt(this.maximumYear) - 35) + '') : ((parseInt(year) + 16) + '');

    let maxYear = new Date().getFullYear();
    this.yearList = this.createYearList(maxYear, this.minimumYear);

  }

  createYearList(maxYear, minYear): any {
    minYear = parseInt(minYear);
    let list = [];
    for (var i = maxYear; i >= minYear; i--) {
      list.push(i.toString());
    }
    return list;

  }


  omit_special_char(event) {
    let k;
    let val = false;
    k = event.charCode;
    if (k == 32 || k >= 48 && k <= 57) {
      return val;
    } else {
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 0 || (k >= 48 && k <= 57) || k == 45 || k >= 128);
    }
  }
  acceptOnlyNumbers(event) {
    let k = event.charCode;
    let val = false;

    if ((k >= 48 && k <= 57 || k == 32 || k == 8 || k == 0) || (k == 118 && event.keyCode == 0)) {
      return;
    } else {
      return val;
    }
  }

  marriageSelected(event) {
    this.isMarried = event.target.value;
    this.validateMandatoryFields(this.event);
    this.trackmartialStatus(this.isMarried);

  }
  validateMandatoryFields(event) {
    let validDrivingLicneceDate = this.validDrivingDate();
    let validDriveKidDate = this.validateDriverKid();;
    let validStartPolicyDate = this.validatePolicyDate();
    let validMarriage = this.validateMarriage();


    if (validDrivingLicneceDate && validDriveKidDate && validStartPolicyDate && validMarriage) {
      this.validatePrivatePerson();
    } else {
      this.disabledNext = false;
    }

  }


  validateMarriage(): boolean {
    if (this.isMarried !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  validatePolicyDate(): boolean {
    if (this.daySelected == "Dzień" || this.daySelected == "DD" || this.daySelected == "") {
      return false;
    } else if (this.monthSelected == "Miesiąc" || this.monthSelected == "MM" || this.monthSelected == "") {
      return false;
    } else if (this.yearSelected == "Rok" || this.monthSelected == "YYYY" || this.yearSelected == "") {
      return false;
    } else {
      let selectedDate = new Date(this.yearSelected, this.monthSelected - 1, this.daySelected);
      let todaysDate = new Date();      
      let daysInMonth = new Date(todaysDate.getFullYear(), todaysDate.getMonth() + 1, 0).getDate();
      let currentMonth = todaysDate.getMonth();
      if(currentMonth == 1){
            daysInMonth = 30;
      }
      let yesterDayDate = new Date();
      yesterDayDate.setDate(yesterDayDate.getDate() - 1);
      let targetDate = new Date();
      targetDate.setDate(todaysDate.getDate() + daysInMonth);
      if ((selectedDate <= yesterDayDate) || (selectedDate > targetDate)) {
        return false;
      } else {
        return true;
      }

    }

  }
  validateDriverKid(): boolean {
    if (this.hasDriverKids !== undefined) {
      if (this.driverKidSelected) {
        if (this.driverKidBirthYear == "Wybierz" || this.driverKidBirthYear == "") {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }

  }

  validDrivingDate(): boolean {
    if (this.dateOfIssueDL == "Wybierz" || this.dateOfIssueDL == "") {
      return false;
    } else {
      return true;
    }
  }

  validatePrivatePerson() {
    let familyName;
    let firstName = this.validateInputFiled(this.driverData.firstName);
    let surname = this.validateInputFiled(this.driverData.surName);
    let pasel = this.isPeselValid(this.driverData.pesel);
    if (firstName && surname && pasel) {
      if (this.isDriverWoman) {
        familyName = this.validateInputFiled(this.driverData.familyName);
        if (familyName) {
          this.disabledNext = false;
        } else {
          this.disabledNext = false;
        }
      } else {
        this.disabledNext = false;
      }
    } else {
      this.disabledNext = false;
    }
  }

  validateInputFiled(field) {
    if (field.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  isPeselValid(pesel): boolean {
    var valid = false;
    if (pesel.length < 11) {
      return valid;
    } else {
      var PESEL = [];
      for (var i = 0; i < pesel.length; i++) {
        PESEL[i] = parseInt(pesel.substring(i, i + 1));
      }
      if (this.checkSum(PESEL) && this.checkMonth(PESEL) && this.checkDay(PESEL)) {
        valid = true;
      }
      else {
        valid = false;
      }
      return valid;
    }
  }
  checkSum(PESEL: any): boolean {
    var sum = 1 * PESEL[0] +
      3 * PESEL[1] +
      7 * PESEL[2] +
      9 * PESEL[3] +
      1 * PESEL[4] +
      3 * PESEL[5] +
      7 * PESEL[6] +
      9 * PESEL[7] +
      1 * PESEL[8] +
      3 * PESEL[9];
    sum %= 10;
    sum = 10 - sum;
    sum %= 10;

    if (sum == PESEL[10]) {
      return true;
    }
    else {
      return false;
    }
  }

  checkMonth(PESEL: any): boolean {
    var month = this.getBirthMonth(PESEL);
    var day = this.getBirthDay(PESEL);
    if (month > 0 && month < 13) {
      return true;
    }
    else {
      return false;
    }
  }
  checkDay(PESEL: any): boolean {
    var year = this.getBirthYearPesel(PESEL);
    var month = this.getBirthMonth(PESEL);
    var day = this.getBirthDay(PESEL);
    if ((day > 0 && day < 32) &&
      (month == 1 || month == 3 || month == 5 ||
        month == 7 || month == 8 || month == 10 ||
        month == 12)) {
      return true;
    }
    else if ((day > 0 && day < 31) &&
      (month == 4 || month == 6 || month == 9 ||
        month == 11)) {
      return true;
    }
    else if ((day > 0 && day < 30 && this.leapYear(year)) ||
      (day > 0 && day < 29 && !this.leapYear(year))) {
      return true;
    }
    else {
      return false;
    }
  }
  leapYear(year: any): any {
    if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)
      return true;
    else
      return false;
  }
  getBirthDay(PESEL: any): any {
    var day;
    day = 10 * PESEL[4];
    day += PESEL[5];
    return day;
  }
  getBirthYearPesel(PESEL: any): any {
    var year;
    var month;
    year = 10 * PESEL[0];
    year += PESEL[1];
    month = 10 * PESEL[2];
    month += PESEL[3];
    if (month > 80 && month < 93) {
      year += 1800;
    }
    else if (month > 0 && month < 13) {
      year += 1900;
    }
    else if (month > 20 && month < 33) {
      year += 2000;
    }
    else if (month > 40 && month < 53) {
      year += 2100;
    }
    else if (month > 60 && month < 73) {
      year += 2200;
    }
    return year;
  }
  getBirthMonth(PESEL: any): any {
    var month;
    month = 10 * PESEL[2];
    month += PESEL[3];
    if (month > 80 && month < 93) {
      month -= 80;
    }
    else if (month > 20 && month < 33) {
      month -= 20;
    }
    else if (month > 40 && month < 53) {
      month -= 40;
    }
    else if (month > 60 && month < 73) {
      month -= 60;
    }
    return month;
  }


  // For Text Field Placeholder text animation 
  addClass(event): void {
    if (event.target.readOnly) {
      event.target.blur();
    }
    event.target.classList.add('is-filled');
  }
  removeClass(event): void {
    if (event.target.value) {
      return;
    }
    if (event.target.classList.contains('ng-invalid') || event.target.value) {
      event.target.classList.remove('is-filled');
    }
  }

  addPopup(isOpen, changeStyle): void {
    isOpen.classList.add("is-open");
    changeStyle.style.visibility = 'visible';
    changeStyle.classList.add("is-visible");
  }

  /*Added for tooltip*/
  addClassTooltip(event, tooltip, tooltippopup): void {
    tooltip.classList.add('has-open-tooltip');
    tooltip.setAttribute("aria-expanded", "true");
    tooltippopup.setAttribute("aria-hidden", "true");
    tooltippopup.classList.add('is-open');
    event.preventDefault();
  }
  removeClassTooltip(event, tooltip, tooltippopup): void {
    tooltip.classList.remove('has-open-tooltip');
    tooltip.setAttribute("aria-expanded", "false");
    tooltippopup.setAttribute("aria-hidden", "false");
    tooltippopup.classList.remove('is-open');
    event.preventDefault();
  }
  /*End for tooltip*/

  emailValidation(event) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.isEmailValid = re.test(event.target.value);
  }

  removeSpace(event) {
    let k = event.charCode;
    if (k == 32) {
      return false;
    }
  }

  acceptNumbersAndPlus(event) {
    let k = event.charCode;
    let val = false;
    if (k >= 48 && k <= 57 || k == 43 || k == 0 || k >= 128) {
      return
    } else {
      return val;
    }
  }

  phoneValiation(event) {
    let re = /^(\+?\d+)$/g;
    let val = event.target.value;
    this.isPhoneValid = re.test(val);

    if (this.isPhoneValid) {
      if (val.length < 9) {
        this.isPhoneValid = false;
      }
    }
  }

  savePageData() {
    if(!this.isEmailValid) {
      this.email = '';
    }
    if(!this.isPhoneValid) {
      this.phone = '';
    }

    if(this.email !== '' || this.phone !== ''){
      this.isEmailPhoneDriverPage = true;
    } else {
      this.isEmailPhoneDriverPage = false;
    }

    let data = {
      driver: this.selectedDriver,
      driverFirstname: this.driverData.firstName,
      driverSurName: this.driverData.surName,
      driverLicenceDate: this.dateOfIssueDL,
      driverFamilyName: this.driverData.familyName,
      driverPesel: this.driverData.pesel,
      driverRegon: this.driverData.regOn,
      driverMarried: this.isMarried,
      driverHasKids: this.driverKidSelected,
      driverKidBirthYear: this.driverKidBirthYear == "Wybierz" ? "" : this.driverKidBirthYear,
      policyStartDate: this.daySelected,
      policyStartMonth: this.monthSelected,
      policyStartYear: this.yearSelected,
      selectedAllConsent: this.selectedAllConsent,
      consent: this.consentsArr,
      questionCatelogueId: this.questionCatelogueId,
      partyId: this.driverData.partyId,
      roleId: this.driverData.roleId,
      emailChannelId: this.driverData.emailChannelId,
      phoneChannelId: this.driverData.phoneChannelId,
      identificationDocumentId: this.driverData.docsId,
      isEmailPhoneDriverPage: this.isEmailPhoneDriverPage,
      driverOtherOptionSel: this.otherDriverSel
    }

    let ownerContacts = {
      "email": this.email,
      "phone": this.phone,
      "emailChannelId": this.driverData.emailChannelId,
      "phoneChannelId": this.driverData.phoneChannelId
    }
    this.applicationData.owner = ownerContacts;
    this.applicationData.currentPageId = this.saveQuoteService.currentPageId;
    sessionStorage.setItem("Application", JSON.stringify(this.applicationData));
    sessionStorage.setItem("driverData", JSON.stringify(data));
  }
  hideErrorPopup(data: any) {
    this.hasErrors = data;
  }
  validateAll(){
    this.nextClicked = true;
    setTimeout(() => {
				this.navigateToNextPage();
			}, 10);
   // document.getElementById("btn_next").click();
    //this.navigateToNextPage();
  }
  navigateToNextPage() {    
    if(document.getElementsByTagName("error").length > 0){
      document.getElementsByTagName("error")[0].parentElement.parentElement.scrollIntoView();
      this.hasErrors=true;
    }else {
      this.disabledNext = true;
      this.isMarketingConsentChecked = true;
      this.sendMarketingConsentToCisl();
      if (!this.checkDuplicatePesel()) {
        this.driverRole();
      }
    }    
  }
  sendContactDetails() {
    if (this.isEmailPhone) {
      if (this.driverPageData == null) {
        if ((this.email !== '' && this.phone !== '') && (this.isEmailValid && this.isPhoneValid)) {
          this.postContactDetails();
        } else {
          this.postUpdateIdDocs();
        }
      } else {
        if ((this.applicationData.owner.email == '' && this.applicationData.owner.phone == '') && (this.email !== '' && this.phone !== '')) {
          this.postContactDetails();
        } else if (this.applicationData.owner.email !== this.email && this.applicationData.owner.phone !== this.phone) {
          let params = [{
            "partySelf": this.driverData.partyId,
            "emailSelf": this.applicationData.owner.emailChannelId,
            "email": this.email,
            "phoneNumberSelf": this.applicationData.owner.phoneChannelId,
            "phoneNumber": this.phone
          }];
          this.cislService.updateContact(this.applicationData.contractId, params).subscribe(data => { this.contactDataUpdateSuccess(data) });
        }
        else if (this.applicationData.owner.email !== this.email) {
          let params = [{
            "partySelf": this.driverData.partyId,
            "emailSelf": this.applicationData.owner.emailChannelId,
            "email": this.email
          }];
          this.cislService.updateContact(this.applicationData.contractId, params).subscribe(data => { this.contactDataUpdateSuccess(data) });
        } else if (this.applicationData.owner.phone !== this.phone) {
          let params = [{
            "partySelf": this.driverData.partyId,
            "phoneNumberSelf": this.applicationData.owner.phoneChannelId,
            "phoneNumber": this.phone
          }];
          this.cislService.updateContact(this.applicationData.contractId, params).subscribe(data => { this.contactDataUpdateSuccess(data) });
        } else {
          //this.savePolicyData();
          this.postUpdateIdDocs();
        }
      }
    } else {
      //this.savePolicyData();
      this.postUpdateIdDocs();
    }

  }


  postContactDetails() {
    let param = [{
      "partySelf": this.driverData.partyId,
      "email": this.email,
      "phoneNumber": this.phone
    }];
    this.cislService.postContactDetails(this.applicationData.contractId, param).subscribe(data => { this.contactDataPostSuccess(data) });
  }

  contactDataUpdateSuccess(data) {
    this.postUpdateIdDocs();
  }
  contactDataPostSuccess(data) {
    this.driverData.emailChannelId = data[0].emailSelf;;
    this.driverData.phoneChannelId = data[0].phoneNumberSelf;
    this.postUpdateIdDocs();
  }

  driverRole() {
    if (this.checkDriverRoleChanged()) {
      if (this.selectedDriver == "mainOwner" || this.selectedDriver == "coOwner" || this.selectedDriver == "coOwner2") {
        this.assignDriverRole();
      } else {
        this.createNewDriverPartyAndRole();
      }
    } else if (this.selectedDriver == "other") {
      this.createNewDriverPartyAndRole();
    } else {
      if (this.driverData.roleId == "" || !this.driverData.roleId) {
        this.assignDriverRole();
      } else {
        this.sendContactDetails();
      }
    }

  }

  assignDriverRole() {
    if (this.selectedDriver == "mainOwner") {
      this.driverData.partyId = this.ownerData.ownerDetails[0].partyId;
    } else if (this.selectedDriver == "coOwner") {
      this.driverData.partyId = this.ownerData.ownerDetails[1].partyId;
    } else {
      this.driverData.partyId = this.ownerData.ownerDetails[2].partyId;
    }
    this.cislService.getDriverRoleIdForOwnerFromCisl(this.applicationData.contractId, this.driverData.partyId).subscribe(data => { this.serializeDriverData(data); });


  }

  createNewDriverPartyAndRole() {
    let params = {
      "firstName": this.driverData.firstName,
      "lastName": this.driverData.surName,
      "maidenName": this.driverData.familyName,
      "peselid": this.driverData.pesel,
      "typeOfOwnerShip": "PP",
      "roleName": "D",
      "companyName": "",
      "regon": this.driverData.regOn
    }
    if (this.driverData.roleId == '') {
      this.cislService.saveOwnerDetails(params, this.applicationData.contractId).subscribe(data => { this.serializeNewDriverData(data); });
    } else {
      this.cislService.updateOwnerDetails(params, this.applicationData.contractId, this.driverData.partyId).subscribe(data => { this.OtherDriverUpdateData(data); });
    }


  }

  OtherDriverUpdateData(data) {
    this.sendContactDetails();
  }

  serializeDriverData(data) {
    this.driverData.roleId = data.self;
    this.sendContactDetails();
  }

  serializeNewDriverData(data) {
    this.driverData.partyId = data.partyId;
    this.driverData.roleId = data.roleId;
    this.sendContactDetails();
  }

  savePolicyData() {
    let policyObj: any;
    let vehicleDetails: any;
    let imported: boolean;
    if (this.carUsageData.carImported == 'yes') {
      imported = true;
    } else {
      imported = false;
    }

    let rightHandDrive: boolean;
    if (this.carDetailsData.sideofwheel == "Right") {
      rightHandDrive = true;
    } else {
      rightHandDrive = false;
    }

    let mileage = this.carUsageData.mileage.replace(/\s/g, '');
    let youngDriver = this.hasDriverKids ? this.hasDriverKids : false;
    let antiTheft = this.carDetailsData.antiTheftValues.toString();
    antiTheft = antiTheft.substring(1);

    vehicleDetails = {
      'licensePlateNumber': this.carUsageData.licence,
      'usage': this.carUsageData.purposeValue,
      'distance': mileage,
      'rightHandedDrive': rightHandDrive,
      'recentImport': imported,
      'garageLocation': this.carUsageData.zipCode,
      'vehicleBrand': this.carDetailsData.carBrand,
      'vehicleModel': this.carDetailsData.carModel,
      'buildYear': this.carDetailsData.prodYear,
      'firstRegistrationDate': this.carUsageData.firstRegistration + "-01-01",
      "expertCatalogIdentificationNumber": this.carDetailsData.carVersionId,
      "purchaseDate": this.carUsageData.carOwnedDate + "-01-01",
      "countryCode": this.carUsageData.countryCode == undefined ? "" : this.carUsageData.countryCode,
      "power": this.carDetailsData.carEnginePower == "Wybierz" ? "" : this.carDetailsData.carEnginePower,
      "cubicCapacity": this.carDetailsData.carEngineSize == "Wybierz" ? "" : this.carDetailsData.carEngineSize,
      "modelDetail": this.carDetailsData.carVersionName,
      "fuelType": this.carDetailsData.fuelType,
      "bodyType": this.carDetailsData.carBody,
      "numberOfDoors": this.carDetailsData.carVersionDoors,
      "antiTheftDevice": antiTheft,
      "placeOfParking": this.carUsageData.parkingValues,
      "yearlyMilageAbroad": this.carUsageData.abroadValue,
      "yearlyMilage": this.carUsageData.plannedMilageValue,
      "vehicleIdentificationNumber": "",
      "majorExistingDamages": false,
      "existingDamageDescription": "",
      "numberOfKeys": 1,
      'youngDriver': youngDriver,
      'youngDriverBirthYear': this.driverKidBirthYear == "Wybierz" ? "" : this.driverKidBirthYear,
    }

    policyObj = {
      'issueDate': this.yearSelected + "-" + this.monthSelected + "-" + this.daySelected,
      'maritalStatus': String(this.isMarried) == "true" ? "M" : "S",
      'vehicleDetails': vehicleDetails
    }

    this.saveQuoteService.autoSavePageData();
    this.cislService.postDriverDetails(policyObj, this.applicationData.contractId, this.applicationData.propertyId).subscribe(data => this.driverDataPost(data));

  }

  postUpdateIdDocs() {
    let params = {
      "licenseIssueYear": this.dateOfIssueDL
    };

    if (this.driverPageData == null || this.driverData.docsId == '' || this.driverPageData.driver == "" || !this.driverData.docsId) {
      this.cislService.postIdentificationNumber(this.applicationData.contractId, this.driverData.partyId, params).subscribe(data => this.partyIdDocsPost(data));
    } else if (this.driverPageData.driver !== this.selectedDriver && this.driverPageData.driver !== "") {
      this.cislService.deleteIdentificationNumber(this.applicationData.contractId, this.prevDriverPartyId, this.driverData.docsId).subscribe();

      this.cislService.postIdentificationNumber(this.applicationData.contractId, this.driverData.partyId, params).subscribe(data => this.partyIdDocsPost(data));
    } else if (this.driverPageData.driverLicenceDate !== this.dateOfIssueDL) {
      this.cislService.putIdentificationNumber(this.applicationData.contractId, this.driverData.partyId, this.driverData.docsId, params).subscribe(data => this.partyIdDocsPost(data));
    } else {
      this.savePolicyData();
    }
  }

  partyIdDocsPost(data) {
    this.driverData.docsId = data.self;
    this.savePolicyData();
  }

  driverDataPost(data) {
    let requestParam = {"contractId" : this.applicationData.contractId, "quoteId" : this.applicationData.quoteId, "email": this.applicationData.owner.email};
    //let requestParam = "contractId=" + this.applicationData.contractId;
    this.getProductOfferings(requestParam);
  }

  checkDriverRoleChanged() {
    if (this.driverPageData !== null) {
      if (this.driverPageData.driver !== this.selectedDriver && this.driverPageData.driver !== "") {
        this.prevDriverPartyId = this.driverData.partyId;
        this.cislService.deleteDriverRole(this.applicationData.contractId, this.driverData.partyId, this.driverData.roleId).subscribe(data => this.driverDelete(data));
        if(this.driverPageData.driver=="other"){
          this.cislService.deleteOwnerDetails(this.applicationData.contractId, this.driverData.partyId).subscribe(data => this.driverDelete(data));
        }
        this.driverData.partyId = "";
        this.driverData.roleId ="";
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  driverDelete(data) { }

  handledriverDelete(error) { }


  navigatePage() {    
    this.router.navigateByUrl('/productbundle');
  }

  navigateToPreviousPage(event) {
    this.saveQuoteService.autoSavePageData();
    this.router.navigateByUrl('/carownerdetails');
  }

  checkDuplicatePesel(): boolean {
    let pesel1 = '';
    let pesel2 = '';
    let pesel3 = '';

    if (this.selectedDriver == "other") {
      if (this.mainOwnerData) {
        pesel1 = this.mainOwnerData.mainOwnerPesel == '' ? this.mainOwnerData.mainOwnerSoleTraderPesel : this.mainOwnerData.mainOwnerPesel;
      }
      if (this.coOwnerData) {
        pesel2 = this.coOwnerData.coOwnerPesel == '' ? this.coOwnerData.coOwnerSoleTraderPesel : this.coOwnerData.coOwnerPesel;
      }
      if (this.coOwner2Data) {
        pesel3 = this.coOwner2Data.coOwner2Pesel == '' ? this.coOwner2Data.coOwner2SoleTraderPesel : this.coOwner2Data.coOwner2Pesel;
      }
      if (this.driverData.pesel == pesel1 || this.driverData.pesel == pesel2 || this.driverData.pesel == pesel3) {
        this.showPeselErr = true;
        return true;
      } else {
        this.showPeselErr = false;
        return false;
      }
    } else {
      this.showPeselErr = false;
      return false;
    }

  }

  /* Get Offering data*/
  getProductOfferings(params) {
    this.cislService.getProductOffers(params).subscribe(data => this.saveProductBundleData(data));
  }
  saveProductBundleData(data) {
    let _data = { 'productData': data };
    sessionStorage.setItem('productBundleData', JSON.stringify(_data));
    this.navigatePage();
  }

  /* Marketing consents */
  getMarketingConsentsFromCisl() {
    this.cislService.getMarketingConsentsFromCisl(this.applicationData.contractId, this.consentsId).subscribe(data => { this.serializeMarketingConsents(data) });
  }

  serializeMarketingConsents(data) {
    this.questionCatelogueId = data[0].questionsCatalogueId;
    this.consentsArr = data[0].decisionQuestion;
  }
  setConsents(data) {
    this.isMarketingConsentChecked = !(data.IsConsentValid);
    this.selectedAllConsent = data.SelectedAllConsents;
    this.consentsArr = data.ConsentArray;
  }

  sendMarketingConsentToCisl() {
    this.cislService.sendMarketingConsentsToCisl(this.applicationData.contractId, this.questionCatelogueId, this.consentsArr).subscribe(data => { console.log(data) });
  }
  validateSpace(event) {
    let value = event.target.value;
    event.target.value = value.replace(/  +/g, ' ');
  }

  titleCaseFirstName(event) {
    this.driverData.firstName = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseSurName(event) {
    this.driverData.surName = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseFamName(event) {
    this.driverData.familyName = this.titleConvert.titleCase(event.target.value);
  }

  omit_special_char_space(event) {
    let k;
    let val = false;
    k = event.charCode;
    if ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 0 || k == 45 || k >= 128 || k == 32) {
      return true;
    } else {
      return false;
    }
  }


  trackdriverkid(date){
                      /*Analytics tracking for car side of wheel  selection*/
        /*if(window && window.om.core.tracking.addSPAEvent) {
            window.om.core.tracking.addSPAEvent("driverkidage", "click", {"driverkidage": date}); // add event to the datalayer
            window._satellite.track("driverkidage"); // trigger dynamic tag manager
        }*/
        /*Analytics tracking end */
  }

  trackmartialStatus(maritalStatus){
                         var maritalStatusString :String;
           if(maritalStatus=="true"){
             
            maritalStatusString="In Married";
          /* ********************DO-NOT-TOUCH***************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.quoteData.carDriverDetails.driverMaritalStatus', maritalStatusString);
            

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */
          
          }else if(maritalStatus=="false") {
            maritalStatusString="Not married";
          
          /* ********************DO-NOT-TOUCH***************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.quoteData.carDriverDetails.driverMaritalStatus', maritalStatusString);
             

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */
          
          
          
          }
        


  }

}

