import { Component, Renderer, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CislService } from '../util/util.cisl.service';
import { OwnerPersonalDetail } from '../commons/OwnerPersonalDetail/OwnerPersonalDetail.component';
import { Injectable } from '@angular/core';
import { ErrorPopUp } from '../commons/popup/popup.component';
import { CallPopUp } from '../commons/popup/callcenterpopup.component';
import { AEMSet, AEMTrack,AEMClearVars } from '../commons/analytics';
import { SaveQuoteService } from '../savequote/quote.save.service';
import { SaveButtonHideShowService } from '../savequote/save.button.hide.show.service';


declare var window: any;

@Component({
  templateUrl: './buy.summary.component.html',
  entryComponents: [ErrorPopUp, CallPopUp]
})
export class SummaryComponent implements OnInit {

  constructor(private router: Router, private cislService: CislService, private saveQuoteService:SaveQuoteService,private _saveButtonShowHide:SaveButtonHideShowService) { } 	

  public x: any;
  public carDetailsData: any;
  public carUsageData: any;
  public ownersData: any;
  public carOwnerData: any;
  public coOwnerData: any;
  public coOwner2Data: any;
  public driverPageData: any;
  public policyPageData: any;
  public productBundleData: any;
  public configurationData:any;

  public carBodyModelVersion: string = "";
  public productionYear: string = "";
  public engineCapacity: string = "";
  public plateNo: string = "";
  public numberOfCarBody: string = "";
  public vin: String;
  public showAndHidePolicyHolderInfoFlag: any = 0;
  public mainOwner: string = '';
  public showMainOwner: boolean = false;
  public showCoOwner: boolean = false;
  public showCoOwner2: boolean = false;
  public startDateOfInsurance: any = '';
  public endDateOfInsurance: any = '';
  public counter: any;
  public coveragesNames: any;
  public coveragesName = [];
  public coveragesItem = [];
  public policyPremium = [];
  public coverageIdArr = [];
  public coverageItems = ''
  public contractId = '';
  public propertyId = '';
  public policyId = '';
  public grossPremium: any;
  public actualPremium: any;
  public premuimData: any;
  public tempModel: any;
  public paymentType ='';

  public responseData = '';
  public coveragesResData: any;
  public carValue:any;
  requestParams = '';
  public showTotalDiscount: boolean;

  public showNameSurname: boolean = false;
  public showCompanyName: boolean = false;
  public showPesel: boolean = false;
  public showRegon: boolean = false;
  public showAddress: boolean = false;
  public showPnone: boolean = false;
  public showEmail: boolean = false;
  public showLeasingRegon: boolean = false;
  public showLeasing: boolean = false;
  public showBankName: boolean = false;

  public isMarketingConsentChecked: boolean = true;
  public consentsId = 'AZONLINE_SUMMARYPAGE';
  public questionCatelogueId: String = '';
  public consentsArr = [];
  public selectedAllConsent: boolean;
  public sessionStoredData: any;
  public isNextFlag: boolean = false;
  public isBuyNowFlag: boolean;
  public flatNo: any;
  public applicationData:any;
  hasErrors:boolean= false;
  nextClicked:boolean = false;
  public todayDate:any;
  public showStaticText:boolean = false;
  public installmentType='';
  SummaryData = {

  };
  public disableConfirmBuy:boolean = false;

  public carOwner = {
    'type': '',
    'nameAndSurname': '',
    'companyName': '',
    'leasingName': '',
    'leasingRegon': '',
    'bankName': '',
    'bankRegOn': '',
    'companyRegOn': '',
    'regon': '',
    'pesel': '',
    'address': ''
  }
  public carCoOwner = {
    'type': '',
    'nameAndSurname': '',
    'companyName': '',
    'leasingName': '',
    'leasingRegon': '',
    'bankName': '',
    'bankRegOn': '',
    'companyRegOn': '',
    'regon': '',
    'pesel': '',
    'address': ''
  }
  public carCoOwner2 = {
    'type': '',
    'nameAndSurname': '',
    'companyName': '',
    'leasingName': '',
    'leasingRegon': '',
    'bankName': '',
    'bankRegOn': '',
    'companyRegOn': '',
    'regon': '',
    'pesel': '',
    'address': ''
  }
  public policyHolderdata = {
    'nameAndSurname': '',
    'surname': '',
    'licensePlateNo': '',
    'companyname': '',
    'leasingName': '',
    'bankName': '',
    'regon': '',
    'pesel': '',
    'address': '',
    'phone': '',
    'email': '',
    'type': ''

  }
  private currentPageId = 8;
  private policyNumber = "";
  ngOnInit() {

      /*code to get current pageName and pageID and send it to adobe analytics*/

       var path = window.location.href;
       var pageData=path.split("#/");
       var currentPageName=pageData[1];
     this.todayDate = new Date();

     if (currentPageName=="summary")
    {
	   var pageName= "Summary page";
     var pageID="car/S8summary:Step8";
    
   	 		/* ********************DO-NOT-TOUCH***************************************** */
                  AEMClearVars();
		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.spapageview', pageName);
               AEMTrack('spapageview');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */
     } //end if condition
  
	 /*code to get current pageName and pageID and send it to adobe analytics end here*/




    let thankyouPage = JSON.parse(sessionStorage.getItem("thankyou"));
    if (thankyouPage != null) {
      this.isNextFlag = thankyouPage.isNextFlag;
    }
    if (this.isNextFlag == false) {
      this.isBuyNowFlag = true;
    }
    this.applicationData = JSON.parse(sessionStorage.getItem('Application'));
    this.carDetailsData = JSON.parse(sessionStorage.getItem("carDetails"));
    this.carUsageData = JSON.parse(sessionStorage.getItem("carusage"));
    this.ownersData = JSON.parse(sessionStorage.getItem("ownerData"));
    this.driverPageData = JSON.parse(sessionStorage.getItem("driverData"));
    this.policyPageData = JSON.parse(sessionStorage.getItem("phData"));
    this.productBundleData = JSON.parse(sessionStorage.getItem('productBundleData'));
    this.configurationData= JSON.parse(sessionStorage.getItem("configData"));
    
    if (this.productBundleData !== null) {
      this.policyId = this.productBundleData.policyId;
    }

    if(this.configurationData !=null){
      this.paymentType =this.configurationData.paymentType.label;
      this.installmentType =this.configurationData.installmentType.label
    }

    if(this.applicationData !== null){
      this.contractId = this.applicationData.contractId;
      this.propertyId = this.applicationData.propertyId;
    }

    this.getStoredData();
    /* Save Quote Listener function*/
    this._saveButtonShowHide.showQuoteId();
    this._saveButtonShowHide.showSaveButton();
    this.addSaveQuoteListener(); 


    if (this.ownersData !== null) {      
      if (this.ownersData.ownerDetails.length === 1) {
        this.carOwnerData = this.ownersData.ownerDetails[0];
      }
      if (this.ownersData.ownerDetails.length === 2) {
        this.carOwnerData = this.ownersData.ownerDetails[0];
        this.coOwnerData = this.ownersData.ownerDetails[1];
      }
      if (this.ownersData.ownerDetails.length === 3) {
        this.carOwnerData = this.ownersData.ownerDetails[0];
        this.coOwnerData = this.ownersData.ownerDetails[1];
        this.coOwner2Data = this.ownersData.ownerDetails[2];
      }
      this.getCarValueDetails();
    }

    if (this.carDetailsData != null) {
      this.carBodyModelVersion = this.carDetailsData.carBrand + " " + this.carDetailsData.carModel.toUpperCase() + " " + this.carDetailsData.carVersionName.toUpperCase();
      this.productionYear = this.carDetailsData.prodYear;
      this.engineCapacity = this.carDetailsData.carEngineSize;
    }
    if (this.policyPageData != null) {
      this.plateNo = this.policyPageData.licensePlateNo == null ? "" : this.policyPageData.licensePlateNo.toUpperCase();
    }

    if (this.policyPageData != null) {
      this.vin = this.policyPageData.vin.toUpperCase();
    }

    if (this.carOwnerData !== null && this.policyPageData != null) {
      this.showMainOwner = true;
      this.carOwner.type = this.carOwnerData.type;
      this.carOwner.nameAndSurname = this.carOwnerData.firstName + " " + this.carOwnerData.surName;
      this.carOwner.pesel = this.carOwnerData.peselId;
      this.carOwner.companyName = this.carOwnerData.companyName;
      this.carOwner.companyRegOn = this.carOwnerData.companyRegOn ? this.carOwnerData.companyRegOn.toUpperCase() : '';;
      if (this.carOwner.type === 'Bank') {
        this.carOwner.bankRegOn = this.carOwnerData.bankRegOn;
      } else {
        this.carOwner.regon = this.carOwnerData.regOn;
      }
      this.carOwner.bankName = this.carOwnerData.bankName ? this.carOwnerData.bankName : '';
      this.carOwner.leasingName = this.carOwnerData.leaseName ? this.carOwnerData.leaseName : '';
      this.carOwner.leasingRegon = this.carOwnerData.leaseRegOn ? this.carOwnerData.leaseRegOn : '';
      this.carOwner.bankRegOn = this.carOwnerData.bankRegOn ? this.carOwnerData.bankRegOn : '';
      this.carOwner.regon = this.carOwnerData.regOn;


      if (this.policyPageData.nonPHAddrCheck.mainOwner == 'yes') {

        this.flatNo = this.policyPageData.selectedOwnerTypeAddrRes[4].value ? " m. " + this.policyPageData.selectedOwnerTypeAddrRes[4].value.toUpperCase() : '';
        this.carOwner.address = this.policyPageData.selectedOwnerTypeAddrRes[2].value.toUpperCase() + " " + this.policyPageData.selectedOwnerTypeAddrRes[3].value.toUpperCase() + this.flatNo + ", " + this.policyPageData.selectedOwnerTypeAddrRes[0].value + " " + this.policyPageData.selectedOwnerTypeAddrRes[1].value.toUpperCase();

      }
      else if (this.policyPageData.nonPHAddrCheck.mainOwner == 'no') {
        this.flatNo = this.policyPageData.mainOwnerAddrRes[4].value ? " m. " + this.policyPageData.mainOwnerAddrRes[4].value.toUpperCase() : '';
        this.carOwner.address = this.policyPageData.mainOwnerAddrRes[2].value.toUpperCase() + " " + this.policyPageData.mainOwnerAddrRes[3].value.toUpperCase() + this.flatNo + ", " + this.policyPageData.mainOwnerAddrRes[0].value + " " + this.policyPageData.mainOwnerAddrRes[1].value.toUpperCase();
      }
    }

    if (this.coOwnerData && this.policyPageData != null) {
      this.showCoOwner = true;
      this.carCoOwner.type = this.coOwnerData.type;
      this.carCoOwner.nameAndSurname = this.coOwnerData.firstName + " " + this.coOwnerData.surName;
      this.carCoOwner.pesel = this.coOwnerData.peselId;
      this.carCoOwner.companyName = this.coOwnerData.companyName ? this.coOwnerData.companyName : '';
      this.carCoOwner.companyRegOn = this.coOwnerData.companyRegOn;

      this.carCoOwner.bankName = this.coOwnerData.bankName ? this.coOwnerData.bankName : '';
      this.carCoOwner.leasingName = this.coOwnerData.leaseName ? this.coOwnerData.leaseName : '';
      this.carCoOwner.bankRegOn = this.coOwnerData.bankRegOn ? this.coOwnerData.bankRegOn : '';
      this.carCoOwner.leasingRegon = this.coOwnerData.leaseRegOn ? this.coOwnerData.leaseRegOn : '';

      if (this.carCoOwner.type === 'Bank') {
        this.carCoOwner.regon = this.coOwnerData.bankRegOn;
      } else {
        this.carCoOwner.regon = this.coOwnerData.regOn;
      }
      this.carCoOwner.bankName = this.coOwnerData.bankName ? this.coOwnerData.bankName : '';
      this.carCoOwner.leasingName = this.coOwnerData.leaseName ? this.coOwnerData.leaseName: '';
      this.carCoOwner.regon = this.coOwnerData.regOn;

      if (this.policyPageData.nonPHAddrCheck.coOwner1 == 'yes') {

        this.flatNo = this.policyPageData.selectedOwnerTypeAddrRes[4].value ? " m. " + this.policyPageData.selectedOwnerTypeAddrRes[4].value.toUpperCase() : '';
        this.carCoOwner.address = this.policyPageData.selectedOwnerTypeAddrRes[2].value.toUpperCase() + " " + this.policyPageData.selectedOwnerTypeAddrRes[3].value + this.flatNo + ", " + this.policyPageData.selectedOwnerTypeAddrRes[0].value + " " + this.policyPageData.selectedOwnerTypeAddrRes[1].value.toUpperCase();
      }
      else if (this.policyPageData.nonPHAddrCheck.coOwner1 == 'no') {
        this.flatNo = this.policyPageData.coOwner1AddrRes[4].value ? " m. " + this.policyPageData.coOwner1AddrRes[4].value.toUpperCase() : '';
        this.carCoOwner.address = this.policyPageData.coOwner1AddrRes[2].value.toUpperCase() + " " + this.policyPageData.coOwner1AddrRes[3].value.toUpperCase() + this.flatNo + ", " + this.policyPageData.coOwner1AddrRes[0].value + " " + this.policyPageData.coOwner1AddrRes[1].value.toUpperCase();
      }
    }

    if (this.coOwner2Data && this.policyPageData != null) {
      this.showCoOwner2 = true;
      this.carCoOwner2.type = this.coOwner2Data.type;
      this.carCoOwner2.nameAndSurname = this.coOwner2Data.firstName + " " + this.coOwner2Data.surName;
      this.carCoOwner2.pesel = this.coOwner2Data.peselId;
      this.carCoOwner2.companyName = this.coOwner2Data.companyName ? this.coOwner2Data.companyName : '';
      this.carCoOwner2.companyRegOn = this.coOwner2Data.companyRegOn;

      this.carCoOwner2.leasingName = this.coOwner2Data.leaseName ? this.coOwner2Data.leaseName : '';
      this.carCoOwner2.bankName = this.coOwner2Data.bankName ? this.coOwner2Data.bankName : '';
      this.carCoOwner2.bankRegOn = this.coOwner2Data.bankRegOn ? this.coOwner2Data.bankRegOn : '';
      this.carCoOwner2.leasingRegon = this.coOwner2Data.leaseRegOn ? this.coOwner2Data.leaseRegOn : '';

      if (this.carCoOwner2.type === 'Bank') {
        this.carCoOwner2.regon = this.coOwner2Data.bankRegOn;
      } else {
        this.carCoOwner2.regon = this.coOwner2Data.regOn;
      }
      this.carCoOwner2.bankName = this.coOwner2Data.bankName ? this.coOwner2Data.bankName : '';;
      this.carCoOwner2.leasingName = this.coOwner2Data.leaseName ? this.coOwner2Data.leaseName: '';
      this.carCoOwner2.regon = this.coOwner2Data.regOn;

      if (this.policyPageData.policyHolderType == 'coOwner2' || this.policyPageData.nonPHAddrCheck.coOwner2 == 'yes') {

        this.flatNo = this.policyPageData.selectedOwnerTypeAddrRes[4].value ? " m. " + this.policyPageData.selectedOwnerTypeAddrRes[4].value.toUpperCase() : '';
        this.carCoOwner2.address = this.policyPageData.selectedOwnerTypeAddrRes[2].value.toUpperCase() + "  " + this.policyPageData.selectedOwnerTypeAddrRes[3].value.toUpperCase() + this.flatNo + ", " + this.policyPageData.selectedOwnerTypeAddrRes[0].value + " " + this.policyPageData.selectedOwnerTypeAddrRes[1].value.toUpperCase();
      }
      else if (this.policyPageData.nonPHAddrCheck.coOwner2 == 'no') {
        this.flatNo = this.policyPageData.coOwner2AddrRes[4].value ? " m. " + this.policyPageData.coOwner2AddrRes[4].value.toUpperCase() : '';
        this.carCoOwner2.address = this.policyPageData.coOwner2AddrRes[2].value.toUpperCase() + " " + this.policyPageData.coOwner2AddrRes[3].value.toUpperCase() + this.flatNo + ", " + this.policyPageData.coOwner2AddrRes[0].value + " " + this.policyPageData.coOwner2AddrRes[1].value.toUpperCase();
      }
    }

    if (this.driverPageData != null) {
      this.startDateOfInsurance = new Date(this.driverPageData.policyStartYear, this.driverPageData.policyStartMonth - 1, this.driverPageData.policyStartDate);

      let todayDay = this.todayDate.getDate();
      let todayMonth = this.todayDate.getMonth();
      let todayYear = this.todayDate.getFullYear();
      if (todayDay == this.driverPageData.policyStartDate && todayMonth == this.driverPageData.policyStartMonth - 1 && todayYear == this.driverPageData.policyStartYear) {
        this.showStaticText = true;
      }


      this.counter = this.driverPageData.policyStartYear;
      this.counter = this.counter + 1;

      let date = new Date(this.counter, this.driverPageData.policyStartMonth - 1, this.driverPageData.policyStartDate);

      let year = date.getFullYear();
      let month = date.getMonth();
      let _date = date.getDate();
      let day = new Date(year, month, _date - 1);

      this.endDateOfInsurance = day;
    }

    if (this.policyPageData) {

      var policyHolderData = this.policyPageData.selectedOwnerTypeData;

      this.policyHolderdata.phone = this.policyPageData.selectedOwnerTypeContact[0].value;
      this.policyHolderdata.email = this.policyPageData.selectedOwnerTypeContact[1].value;

      for (var i = 0; i < policyHolderData.length; i++) {
        if (policyHolderData[i].key == "Nazwa" || policyHolderData[i].key == "Nazwisko") {
          this.showNameSurname = true;
          this.showPnone = true;
          this.showEmail = true;
          this.showAddress = true;
          this.showPesel = true;
          this.showCompanyName = false;
          this.showRegon = false;
          this.showLeasing = false;
          this.showLeasingRegon = false;

          this.policyHolderdata.nameAndSurname = policyHolderData[0].value + " " + policyHolderData[1].value;
        } else if (policyHolderData[i].key == "REGON") {
          this.showRegon = true;
          this.policyHolderdata.regon = policyHolderData[i].value;

        } else if (policyHolderData[i].key == "Nazwa banku") {
          this.policyHolderdata.bankName = policyHolderData[i].value;
          this.showAddress = true;
          this.showEmail = true;
          this.showBankName = true;
          this.showRegon = true;
          this.showNameSurname = false;
          this.showLeasing = false;
          this.showCompanyName = false;
        } else if (policyHolderData[i].key == "Nazwa firmy") {
          this.policyHolderdata.companyname = policyHolderData[i].value;
          this.showAddress = true;
          this.showCompanyName = true;
          this.showRegon = true;
          this.showPnone = true;
          this.showEmail = true;
          this.showNameSurname = false;
          this.showLeasing = false;
          this.showBankName = false;

        } else if (policyHolderData[i].key == "Nazwa firmy") {
          this.policyHolderdata.leasingName = policyHolderData[i].value;
          this.showLeasing = true;
          this.showRegon = true;
          this.showAddress = true;
          this.showEmail = true;
          this.showNameSurname = false;
          this.showCompanyName = false;
          this.showPnone = false;
          this.showNameSurname = false;
          this.showBankName = false;


        } else if (policyHolderData[i].key == "PESEL") {
          this.policyHolderdata.pesel = policyHolderData[i].value;
          this.showCompanyName = false;
        }

      }
      if (this.policyPageData.isMailingAddSame == 'false') {
        this.flatNo = this.policyPageData.selectedOwnerTypeAddrMail[4].value ? " m. " + this.policyPageData.selectedOwnerTypeAddrMail[4].value.toUpperCase() : '';
        this.policyHolderdata.address = this.policyPageData.selectedOwnerTypeAddrMail[2].value.toUpperCase() + " " + this.policyPageData.selectedOwnerTypeAddrMail[3].value.toUpperCase() + this.flatNo + ", " + this.policyPageData.selectedOwnerTypeAddrMail[0].value + " " + this.policyPageData.selectedOwnerTypeAddrMail[1].value.toUpperCase();
      } else {
        this.flatNo = this.policyPageData.selectedOwnerTypeAddrRes[4].value ? " m. " + this.policyPageData.selectedOwnerTypeAddrRes[4].value.toUpperCase() : '';
        this.policyHolderdata.address = this.policyPageData.selectedOwnerTypeAddrRes[2].value.toUpperCase() + "  " + this.policyPageData.selectedOwnerTypeAddrRes[3].value.toUpperCase() + this.flatNo + ", " + this.policyPageData.selectedOwnerTypeAddrRes[0].value + " " + this.policyPageData.selectedOwnerTypeAddrRes[1].value.toUpperCase();
      }

    }
    this.cislService.getDataFromCislPolicyCoverage(this.contractId, this.policyId).subscribe(data => this.serializePolicyCoverages(data));
  }

  private addSaveQuoteListener(): void {
    this.saveQuoteService.currentPageId = this.currentPageId;
    this.saveQuoteService.SaveQuote.subscribe(() => {      
        this.saveToSession();
    });
  }

  serializePolicyPremium(data) {
    let model = data;
    this.premuimData = data;
    let grossAmountStr = model.grossPremium;
    let totalDiscountStr = model.totalDiscount;

    let grossAmountSplit = grossAmountStr.split(' ');
    grossAmountSplit = grossAmountSplit[1];

    let discountAmountSplit = totalDiscountStr.split(' ');
    discountAmountSplit = discountAmountSplit[1];

    let totalAmt = String(grossAmountSplit - discountAmountSplit);

    let decimalTotalAmt = Number(totalAmt);
    decimalTotalAmt = decimalTotalAmt % 1;
    totalAmt = decimalTotalAmt == 0 ? totalAmt + ".00" : totalAmt;

    totalAmt = Number(totalAmt).toFixed(2);

    this.grossPremium = grossAmountSplit.replace('.',',');
    this.actualPremium = totalAmt.replace('.',',');
    this.grossPremium = this.grossPremium.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    this.actualPremium = this.actualPremium.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    this.getCoveragesId();
  }

  getCoveragesId() {
    let model = this.coveragesResData;
    let coverAll = model.coverages;
    this.coverageIdArr = [];
    for (let i = 0; i < coverAll.length; i++) {
      if (coverAll[i].coverageItems) {
        this.coverageIdArr.push(coverAll[i].self);
      }
    }
    this.getCoveragesPremium(this.coverageIdArr);

  }

  getCoveragesPremium(coverageIds) {
    let arr = [];
    for (let i = 0; i < coverageIds.length; i++) {
      let obj = { "GrossPremium": "", "TotalDiscount": "" };
      let coverages = this.premuimData.coveragePremium;
      for (let j = 0; j < coverages.length; j++) {
        if (coverageIds[i] == coverages[j].coverageLink) {
          obj.GrossPremium = coverages[j].grossPremium;
          obj.TotalDiscount = coverages[j].totalDiscount;
        }
      }
      if (this.grossPremium === this.actualPremium) {
        this.showTotalDiscount = false;
      }
      else {
        this.showTotalDiscount = true;
      }
      arr.push(obj);
    }
    this.assignCoveragePrice(arr);
  }

  assignCoveragePrice(priceArr) {
    for (let i = 0; i < priceArr.length; i++) {
      let price = this.calculatePrice(priceArr[i]);
      this.coveragesItem[i].price = price;
      this.coveragesItem[i].price = this.coveragesItem[i].price.replace('.',',');
      this.coveragesItem[i].price = this.coveragesItem[i].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    for (let j=0;j < this.coveragesItem.length; j++){
      if(Number(this.coveragesItem[j].price.split(",")[0])<=0){
        this.coveragesItem.splice(j,1);
        j=j-1;
      }
    }
  }

  calculatePrice(obj) {
    let grossAmountStr = obj.GrossPremium;
    let totalDiscountStr = obj.TotalDiscount;

    let grossAmountSplit = grossAmountStr.split(' ');
    grossAmountSplit = grossAmountSplit[1];

    let totalAmountSplit = totalDiscountStr.split(' ');
    totalAmountSplit = totalAmountSplit[1];

    let totalNum = String(grossAmountSplit - totalAmountSplit);

    let decimalTotalAmt = Number(totalNum);
    decimalTotalAmt = decimalTotalAmt % 1;

    let finalPrice = decimalTotalAmt == 0 ? totalNum + ".00" : totalNum;
    finalPrice = Number(finalPrice).toFixed(2);
    return finalPrice;
  }

  serializePolicyCoverages(data) {
    let dataObj = data;
    this.coveragesResData = dataObj.policy;
    this.coveragesItem = [];
    let model = dataObj.policy;
    let coveragenm = model.coverages;
    for (let i = 0; i < coveragenm.length; i++) {
      this.tempModel = { selection: 'true', name: '', sign: '', price: '' };
      this.tempModel.name = coveragenm[i].name;
      if (coveragenm[i].coverageItems != null) {
        this.getPolicyCoverage(coveragenm[i]);
      }
    }
    this.serializePolicyPremium(dataObj.policyPremium);
  }
  getPolicyCoverage(coveragenm) {
    let item = coveragenm.coverageItems;
    for (let j = 0; j < item.length; j++) {
      if(item[j].selection.selected==true){
        this.tempModel.sign = item[j].name;        
      }      
    }
    this.coveragesItem.push(this.tempModel);
  }

  showAndHidePolicyHolderInfo(ele: any): void {
    if (this.showAndHidePolicyHolderInfoFlag == 0) {
      ele.classList.add("is-opened");
      this.showAndHidePolicyHolderInfoFlag = 1;
    } else {
      ele.classList.remove("is-opened");
      this.showAndHidePolicyHolderInfoFlag = 0;
    }
  }

  editYourCar() {
    this.router.navigateByUrl('/cardetails');
  }
  editPolicyHolder() {
    this.router.navigateByUrl('/policyholder');
  }

  getStoredData() {
    let data = JSON.parse(sessionStorage.getItem("SummaryData"));
    if (data !== null) {
      this.sessionStoredData = data;
      this.questionCatelogueId = data.questionCatID;
      this.consentsArr = data.consentsArr;
      this.selectedAllConsent = data.selectedAllConsent;
      this.isMarketingConsentChecked = data.marketingConsentChecked;
      this.policyNumber = data.policyNumber;
    } else {
      this.getMarketingConsentsFromCisl();
    }
  }
  savePageData() {
    this.nextClicked=true;
    if(this.isMarketingConsentChecked){
      if (this.isNextFlag == false) {
        this.disableConfirmBuy = true;
      this.isMarketingConsentChecked = true;
      this.cislService.postIssuePolicy(this.policyId).subscribe(data => this.postIssuePolicyData(data));
      this.sendMarketingConsentToCisl();
    } else {
      this.isNextFlag = true;
      this.isBuyNowFlag = false;
    }
    }else {
      this.hasErrors = true;
    }    
   
    var policyBuyNow="policyIssued";
     	 		/* ********************DO-NOT-TOUCH***************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.quoteData.policyBuyNow', policyBuyNow);
           

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */




  }
  postIssuePolicyData(data) {
    this.policyNumber = data.policyNumbers[0];
    this.saveQuoteService.isBuyNowClicked = true;
    this.saveQuoteService.autoSavePageData();
    this._saveButtonShowHide.hideSaveButton();
    this.router.navigateByUrl('/thankyou');
  }

  saveToSession(){
    let summarydata = {
      "PolicyPrice": this.actualPremium,
      "questionCatID": this.questionCatelogueId,
      "consentsArr": this.consentsArr,
      "selectedAllConsent": this.selectedAllConsent,
      "marketingConsentChecked": this.isMarketingConsentChecked,
      "isNextFlag": this.isNextFlag,
      "policyNumber" : this.policyNumber
    }
    sessionStorage.setItem("SummaryData", JSON.stringify(summarydata));
  }

  /* Get Property value */
  getCarValueDetails() {
    this.cislService.getPropertyDetails(this.contractId, this.propertyId).subscribe(data => this.assignCarValue(data));
  }

  assignCarValue(data) {
    let value = data.currentValue;
    if (value != undefined) {
      value = value.split(' ');
      this.carValue = Number(value[1]);
      this.carValue = this.carValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
  }
  /* Markting Consent*/
  getMarketingConsentsFromCisl() {
    this.cislService.getMarketingConsentsFromCisl(this.contractId, this.consentsId).subscribe(data => { this.serializeMarketingConsents(data) });
  }

  serializeMarketingConsents(data) {
    this.questionCatelogueId = data[0].questionsCatalogueId;
    this.consentsArr = data[0].decisionQuestion;
  }
  setConsents(data) {
    this.isMarketingConsentChecked = (data.IsConsentValid);
    this.selectedAllConsent = data.SelectedAllConsents;
    this.consentsArr = data.ConsentArray;
  }
  sendMarketingConsentToCisl() {
    this.cislService.sendMarketingConsentsToCisl(this.contractId, this.questionCatelogueId, this.consentsArr).subscribe(data => { console.log(data) });
  }
  hideErrorPopup(data: any) {
    this.hasErrors = false;
  }
  isNextClick() {    
    this.nextClicked=true;
    if(!this.isMarketingConsentChecked){
      this.hasErrors = true;
    } else {      
      this.saveQuoteService.autoSavePageData();
      this._saveButtonShowHide.hideSaveButton();
      this.router.navigateByUrl('/thankyou');
    }    
  }

}