import { Component, Renderer, ViewChild, ElementRef, AfterViewInit, OnInit, DoCheck } from '@angular/core';
import { TranslateService } from '../../commons/translate';
import { TextValidationService } from '../../commons/services/quote.textvalidation.service';
import { UpperCasePipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { CislService } from '../../util/util.cisl.service';
import { ValidateService } from '../../commons/services/validate.service';
import { UrlSerializer } from '@angular/router';
import { CustomUrlSerializer } from '../../commons/customurl/customUrlSerializer';
import { ErrorPopUp } from '../../commons/popup/popup.component';
import { CallPopUp } from '../../commons/popup/callcenterpopup.component';
import { CamelCaseConvert } from '../../util/title.camel.case.service';

import { AEMSet, AEMTrack,AEMClearVars } from '../../commons/analytics';

import { SaveQuoteService } from '../../savequote/quote.save.service';
import { SaveButtonHideShowService } from '../../savequote/save.button.hide.show.service';

import { PolicyHolderPageDataDefinitionService } from '../../commons/services/policyholder.page.data.definition.service.';


declare var window: any;

@Component({
  templateUrl: '../html/quote.policyholder.component.html',
  entryComponents: [ErrorPopUp, CallPopUp],
  styles: ['input[readonly] {pointer-events:none;}']
})
export class PolicyHolderComponent implements OnInit {
  @ViewChild('Telephone') Telephone: ElementRef

  constructor(private validator: TextValidationService, private _validateServices: ValidateService,
    private router: Router, private cislService: CislService, private titleConvert: CamelCaseConvert,
    private saveQuoteService:SaveQuoteService, private _saveButtonShowHide:SaveButtonHideShowService,
    private phDataDef:PolicyHolderPageDataDefinitionService) { }

  nextClicked:boolean = false;
  hasErrors:boolean = false;
  phPeselInvalid:boolean = false;
  resZipInvalid:boolean = false;
  mailZipInvalid:boolean = false;
  phoneInvalid:boolean = false;
  emailInvalid:boolean = false;
  public policyHolderTypes = this.phDataDef.policyHolderTypes;
  public policyHolderType: string;
  public partyIds = this.phDataDef.partyIds;
  public roleIds = this.phDataDef.roleIds;
  public addressIds = this.phDataDef.addressIds
  public contactIds = this.phDataDef.contactIds;
  public contractId: string;
  public person = [];
  public company = [];
  public mainOwner = [];
  public zipValidCheck = [];
  public townValidCheck = [];
  public streetValidCheck = [];
  public houseValidCheck = [];

  public licensePlateNo: string;
  public licensePlateNoSession: string;
  public propertyId: string = '';

  public coOwner1 = [];

  public coOwner2 = [];

  public driver = [];
  public other = this.phDataDef.other;
  public showDriverData: boolean;
  public carUsageData: any;
  public driverData: any;
  public ownerData: any;

  public selectedOwnerTypeData: any;
  public selectedOwnerTypeContact = this.phDataDef.selectedOwnerTypeContact;
  public selectedOwnerTypeAddrRes = this.phDataDef.selectedOwnerTypeAddrRes;
  public selectedOwnerTypeAddrMail = this.phDataDef.selectedOwnerTypeAddrMail;
  public mainOwnerContact = this.phDataDef.mainOwnerContact;
  public mainOwnerAddrRes = this.phDataDef.mainOwnerAddrRes;
  public coOwner1AddrRes = this.phDataDef.coOwner1AddrRes;
  public coOwner2AddrRes = this.phDataDef.coOwner2AddrRes;
  public nonPHAddrCheck = this.phDataDef.nonPHAddrCheck;
  public disabledInputFields: boolean = false;
  public nonPH = [];

  public isMailingAddSame: string = 'true';
  public noAvailableOwners: number;
  public noOwnerDetailsToGet: number;
  public avilableOwnerList = [];
  public ownerDetailsToGet = [];
  public isCarDamaged: string = '';
  public noOfKeys: string = '';
  public setupSession: string = 'cessionNo';

  public diffMailigAddData: object;
  public vin: string = '';
  public licensePlate: boolean = false;
  public cessionData: object = this.phDataDef.cessionData;
  public bankList: Array<object> = [];

  public allFieldsValid: boolean = false;
  public phSessionData: any;

  private prvKeycode;

  public contactHttpMethod = '';
  public onLoad: boolean;
  public pesels = [];
  public policyId = '';
  public damagedDesc = '';
  public consentsArr = [];
  public selectedAllConsent: boolean;
  public isMarketingConsentChecked: boolean = true;
  public consentsId = 'AZONLINE_POLICYHOLDER';
  public questionCatelogueId: String = '';
  public applicationData: any;
  private currentPageId:number= 7;
  public disabledNext:boolean = false;

  ngOnInit(): void {
      
     /*code to get current pageName and pageID and send it to adobe analytics*/

       var path = window.location.href;
       var pageData=path.split("#/");
       var currentPageName=pageData[1];
      
     

     if (currentPageName=="policyholder")
    {
	   var pageName= "Policy Holder";
     var pageID="car/S7policyholderDetail:Step7";
    
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


   

    this.applicationData =  JSON.parse(sessionStorage.getItem("Application"));
    this.contractId = this.applicationData.contractId;  
    this.propertyId=this.applicationData.propertyId;  
    this.onLoad= true;
    var productBundle = JSON.parse(sessionStorage.getItem('productBundleData'));
    if (productBundle != null || productBundle != undefined) {
      this.policyId = productBundle.policyId;
    }
    this.carUsageData = JSON.parse(sessionStorage.getItem("carusage"));
    this.licensePlateNoSession = this.carUsageData.licence;
    this.licensePlateNo = (this.licensePlateNoSession == '' || this.licensePlateNoSession == null) ? '' : this.licensePlateNoSession;

    this.phSessionData = JSON.parse(sessionStorage.getItem("phData"));
    if (this.phSessionData != null || this.phSessionData != undefined) {
      this.getOwnerAndDriverData();
      this.policyHolderType = this.phSessionData.policyHolderType;
      this.selectedOwnerTypeData = this.phSessionData.selectedOwnerTypeData;
      this.isMailingAddSame = this.phSessionData.isMailingAddSame;
      if (this.phSessionData.policyHolderType != 'mainOwner') {
        this.selectedOwnerTypeContact = this.phSessionData.selectedOwnerTypeContact;
      }
      this.selectedOwnerTypeAddrRes = this.phSessionData.selectedOwnerTypeAddrRes;
      this.selectedOwnerTypeAddrMail = this.phSessionData.selectedOwnerTypeAddrMail;
      this.vin = this.phSessionData.vin;
      this.licensePlateNo = this.phSessionData.licensePlateNo;      
      this.noOfKeys = this.phSessionData.noOfKeys;
      this.isCarDamaged = this.phSessionData.isCarDamaged;
      this.setupSession = this.phSessionData.setupSession;
      this.nonPHAddrCheck = this.phSessionData.nonPHAddrCheck;
      this.nonPH = this.phSessionData.nonPH;
      this.addressIds = this.phSessionData.addressIds;
      this.contactIds = this.phSessionData.contactIds;
      this.roleIds = this.phSessionData.roleIds;
      this.partyIds = this.phSessionData.partyIds;
      this.damagedDesc = this.phSessionData.damagedDesc;
      this.licensePlate = this.phSessionData.licensePlate;
      if(this.phSessionData.isFromRestore){
        this.getOwnerAndDriverData();
        this.phSessionData.isFromRestore = false;
      }
      for (var i = 0; i < this.nonPH.length; i++) {
        if (this.nonPHAddrCheck[this.nonPH[i]] == 'no') {
          this[this.nonPH[i] + "AddrRes"] = this.phSessionData[this.nonPH[i] + 'AddrRes'];
        }
      }
      if (this.phSessionData.consentsArr.length > 0) {
        //this.getMarketingConsentsFromCisl();
        this.consentsArr = this.phSessionData.consentsArr;
        this.selectedAllConsent = this.phSessionData.selectedAllConsent;
        this.questionCatelogueId = this.phSessionData.questionCatelogueId;
      } else {
        this.getMarketingConsentsFromCisl();
      }
    } else {
      this.getOwnerAndDriverData();
      this.getMarketingConsentsFromCisl();
    }
    this.showSelectedHolder();


    /* Listener function for save quote */
    this._saveButtonShowHide.showQuoteId();
    this._saveButtonShowHide.showSaveButton();
    this.saveQuoteService.currentPageId = this.currentPageId;
    this.saveQuoteService.SaveQuote.subscribe(() => {
      if (this.saveQuoteService.currentPageId == this.currentPageId) {
        if (this.saveQuoteService.isFromEmailPhonePopup) {
          this.applicationData = JSON.parse(sessionStorage.getItem('Application')); 
          this.mainOwnerContact[0].value = this.applicationData.owner.phone;
          this.mainOwnerContact[1].value = this.applicationData.owner.email; 
          this.selectedOwnerTypeContact[0].value =  this.applicationData.owner.phone;
          this.selectedOwnerTypeContact[1].value =  this.applicationData.owner.email;   
        }
        this.setSessionData();
      }
    });
  }

  ngDoCheck(): void {
    if (this.checkAllFieldValidations()) {
      this.allFieldsValid = true;
    } else {
      this.allFieldsValid = false;
    }
  }
  ngViewAfterInit(): void {
    this.showSelectedHolder();
  }
  checkPesel(key, value){
    if(key == 'PESEL'){
      if(!this._validateServices.validatePesel(value) || !this.checkDuplicatePesel(value)){
        this.phPeselInvalid = true;
      }
    }
  }
  validate(event, fieldName) {
    if (this._validateServices.validateFields(event, fieldName)) {
      return true;
    } else {
      return false;
    }
  }
  setContactData(data: any) {
    if (data.key == "main owner") {
      this.mainOwnerContact = data.value;
    }
  }
  setAddrData(data: any) {
    if (data.key == "main owner") {
      this.mainOwnerAddrRes = data.value;
    } else if (data.key == "owner 1") {
      this.coOwner1AddrRes = data.value;
    } else {
      this.coOwner2AddrRes = data.value;
    }
  }
  setAddressCheck(data: any) {
    if (data.key == "main owner") {
      this.nonPHAddrCheck['mainOwner'] = data.value;
    } else if (data.key == "owner 1") {
      this.nonPHAddrCheck['coOwner1'] = data.value;
    } else {
      this.nonPHAddrCheck['coOwner2'] = data.value;
    }
  }
  getOwnerAndDriverData(): void {
    this.carUsageData = JSON.parse(sessionStorage.getItem("carusage"));
    this.driverData = JSON.parse(sessionStorage.getItem("driverData"));
    this.ownerData = JSON.parse(sessionStorage.getItem("ownerData"));

    if (this.applicationData.owner != undefined && (this.applicationData.owner.phoneChannelId != "" && this.applicationData.owner.phoneChannelId)) {
      this.contactIds['mainOwner']['phoneSelf'] = this.applicationData.owner.phoneChannelId;
    }
    if (this.applicationData.owner != undefined && (this.applicationData.owner.emailChannelId != "" && this.applicationData.owner.emailChannelId)) {
      this.contactIds['mainOwner']['emailSelf'] = this.applicationData.owner.emailChannelId;
    }
    if (JSON.parse(sessionStorage.getItem("driverData")).driver == 'other') {
      this.policyHolderTypes.driver = true;
      this.policyHolderType = "driver";
      this.populateDriverData(this.driverData, this.ownerData);
    }
    this.policyHolderType = "mainOwner";
    this.noAvailableOwners = this.ownerData.ownerDetails.length;
    this.avilableOwnerList.push("mainOwner");
    this.populateMainOwnerData(this.driverData, this.ownerData);
    this.policyHolderTypes.mainOwner = true;
    if (this.noAvailableOwners >= 2) {
      this.avilableOwnerList.push("coOwner1");
      this.populateCoOwnerData(this.ownerData);
      this.policyHolderTypes.coOwner1 = true;
      if (this.noAvailableOwners == 3) {
        this.avilableOwnerList.push("coOwner2");
        this.populateCoOwner2Data(this.ownerData);
        this.policyHolderTypes.coOwner2 = true;
      }
    }
  }
  populateDriverData(driverData, ownerData) {
    this.driver = [{ "key": "Nazwa", "value": driverData.driverFirstname },
    { "key": "Nazwisko", "value": driverData.driverSurName },
    { "key": "PESEL", "value": driverData.driverPesel },
    { "key": "Nazwisko rodowe", "value": driverData.driverFamilyName },
    { "key": "REGON", "value": driverData.driverRegon }];
    this.pesels.push(driverData.driverPesel);
    this.driver = this.driver.filter(item => item.value != "");
    this.partyIds.driver = driverData.partyId;
  }
  populateMainOwnerData(driverData, ownerData) {
    if (ownerData.ownerDetails[0].type != "PrivatePerson" && ownerData.ownerDetails[0].type != "SoleTrader") {
      if (ownerData.ownerDetails[0].type == "Company") {
        this.mainOwner = [{ "key": "Nazwa firmy", "value": ownerData.ownerDetails[0].companyName },
        { "key": "REGON", "value": ownerData.ownerDetails[0].companyRegOn }];
      } else if (ownerData.ownerDetails[0].type == "Bank") {
        this.mainOwner = [{ "key": "Nazwa banku", "value": ownerData.ownerDetails[0].bankName },
        { "key": "REGON", "value": ownerData.ownerDetails[0].bankRegOn }];
      } else {
        this.mainOwner = [{ "key": "Nazwa firmy", "value": ownerData.ownerDetails[0].leaseName },
        { "key": "REGON", "value": ownerData.ownerDetails[0].leaseRegOn }];
      }
    } else {
      this.mainOwner = [{ "key": "Nazwa", "value": ownerData.ownerDetails[0].firstName },
      { "key": "Nazwisko", "value": ownerData.ownerDetails[0].surName },
      { "key": "PESEL", "value": ownerData.ownerDetails[0].peselId },
      { "key": "Nazwisko rodowe", "value": ownerData.ownerDetails[0].familyName },
      { "key": "REGON", "value": ownerData.ownerDetails[0].regOn }];
      this.pesels.push(ownerData.ownerDetails[0].peselId);
    }
    this.mainOwner = this.mainOwner.filter(item => item.value != "");
    if (this.applicationData.owner != undefined && this.applicationData.owner.phone != "") {
      this.mainOwnerContact[0].value = this.applicationData.owner.phone;
    }
    if (this.applicationData.owner != undefined && this.applicationData.owner.email != "") {
      this.mainOwnerContact[1].value = this.applicationData.owner.email;
    }
    this.partyIds.mainOwner = ownerData.ownerDetails[0].partyId;
  }
  populateCoOwnerData(ownerData) {
    if (ownerData.ownerDetails[1].type != "PrivatePerson" && ownerData.ownerDetails[1].type != "SoleTrader") {
      if (ownerData.ownerDetails[1].type == "Company") {
        this.coOwner1 = [{ "key": "Nazwa firmy", "value": ownerData.ownerDetails[1].companyName },
        { "key": "REGON", "value": ownerData.ownerDetails[1].companyRegOn }];
      } else if (ownerData.ownerDetails[1].type == "Bank") {
        this.coOwner1 = [{ "key": "Nazwa banku", "value": ownerData.ownerDetails[1].bankName },
        { "key": "REGON", "value": ownerData.ownerDetails[1].bankRegOn }];
      } else {
        this.coOwner1 = [{ "key": "Nazwa firmy", "value": ownerData.ownerDetails[1].leaseName },
        { "key": "REGON", "value": ownerData.ownerDetails[1].leaseRegOn }];
      }
    } else {
      this.coOwner1 = [{ "key": "Nazwa", "value": ownerData.ownerDetails[1].firstName },
      { "key": "Nazwisko", "value": ownerData.ownerDetails[1].surName },
      { "key": "PESEL", "value": ownerData.ownerDetails[1].peselId },
      { "key": "Nazwisko rodowe", "value": ownerData.ownerDetails[1].familyName },
      { "key": "REGON", "value": ownerData.ownerDetails[1].regOn }];
      this.pesels.push(ownerData.ownerDetails[1].peselId);
    }
    this.coOwner1 = this.coOwner1.filter(item => item.value != "");
    this.partyIds.coOwner1 = ownerData.ownerDetails[1].partyId;
  }
  populateCoOwner2Data(ownerData) {
    if (ownerData.ownerDetails[2].type != "PrivatePerson" && ownerData.ownerDetails[2].type != "SoleTrader") {
      if (ownerData.ownerDetails[2].type == "Company") {
        this.coOwner2 = [{ "key": "Nazwa firmy", "value": ownerData.ownerDetails[2].companyName },
        { "key": "REGON", "value": ownerData.ownerDetails[2].companyRegOn }];
      } else if (ownerData.ownerDetails[2].type == "Bank") {
        this.coOwner2 = [{ "key": "Nazwa banku", "value": ownerData.ownerDetails[2].bankName },
        { "key": "REGON", "value": ownerData.ownerDetails[2].bankRegOn }];
      } else {
        this.coOwner2 = [{ "key": "Nazwa firmy", "value": ownerData.ownerDetails[2].leaseName },
        { "key": "REGON", "value": ownerData.ownerDetails[2].leaseRegOn }];
      }
    } else {
      this.coOwner2 = [{ "key": "Nazwa", "value": ownerData.ownerDetails[2].firstName },
      { "key": "Nazwisko", "value": ownerData.ownerDetails[2].surName },
      { "key": "PESEL", "value": ownerData.ownerDetails[2].peselId },
      { "key": "Nazwisko rodowe", "value": ownerData.ownerDetails[2].familyName},
      { "key": "REGON", "value": ownerData.ownerDetails[2].regOn }];
      this.pesels.push(ownerData.ownerDetails[2].peselId);
    }
    this.coOwner2 = this.coOwner2.filter(item => item.value != "");
    this.partyIds.coOwner2 = ownerData.ownerDetails[2].partyId;
  }
  showSelectedHolder(): void {
    if (this.policyHolderType == 'mainOwner') {
      this.selectedOwnerTypeData = this.mainOwner;
      this.disabledInputFields = true;
      this.noOwnerDetailsToGet = this.noAvailableOwners - 1;
      if (this.phSessionData != null) {
        if (this.phSessionData.policyHolderType != this.policyHolderType) {
          this.resetContactDetails();
          this.resetAddrDetails();
        }
      }
      for (var i = 0; i < this.mainOwnerContact.length; i++) {
        this.selectedOwnerTypeContact[i].key = this.mainOwnerContact[i].key;
        this.selectedOwnerTypeContact[i].value = this.mainOwnerContact[i].value;
      }
      this.updateOwnerDetaileToGet('mainOwner');
      this.onLoad = false;
    } else if (this.policyHolderType == 'driver') {
      this.selectedOwnerTypeData = this.driver;
      this.disabledInputFields = true;
      this.noOwnerDetailsToGet = this.noAvailableOwners;
      if (!this.onLoad) {
        this.resetContactDetails();
        this.resetAddrDetails();
      }
      if (this.phSessionData != null) {
        if (this.phSessionData.policyHolderType != this.policyHolderType) {
          this.resetAddrDetails();
        }
      }
      this.updateOwnerDetaileToGet('driver');
      this.onLoad = false;
    } else if (this.policyHolderType == 'coOwner1') {
      this.selectedOwnerTypeData = this.coOwner1;
      this.disabledInputFields = true;
      this.noOwnerDetailsToGet = this.noAvailableOwners - 1;
      if (!this.onLoad) {
        this.resetContactDetails();
        this.resetAddrDetails();
      }
      if (this.phSessionData != null) {
        if (this.phSessionData.policyHolderType != this.policyHolderType) {
          this.resetAddrDetails();
        }
      }
      this.updateOwnerDetaileToGet('coOwner1');
      this.onLoad = false;
    } else if (this.policyHolderType == 'coOwner2') {
      this.selectedOwnerTypeData = this.coOwner2;
      this.disabledInputFields = true;
      this.noOwnerDetailsToGet = this.noAvailableOwners - 1;
      if (!this.onLoad) {
        this.resetContactDetails();
        this.resetAddrDetails();
      }
      if (this.phSessionData != null) {
        if (this.phSessionData.policyHolderType != this.policyHolderType) {
          this.resetAddrDetails();
        }
      }
      this.updateOwnerDetaileToGet('coOwner2');
      this.onLoad = false;
    } else {
      if (!this.onLoad) {
        this.selectedOwnerTypeData = this.other;
        this.resetPersonalDetails(this.other);
        this.resetContactDetails();
        this.resetAddrDetails();
      }
      this.disabledInputFields = false;
      this.noOwnerDetailsToGet = this.noAvailableOwners;
      this.updateOwnerDetaileToGet('other');
      this.onLoad = false;
    }

      	 		/* ********************DO-NOT-TOUCH***************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.quoteData.policyHolderdetails.policyHolderType', this.policyHolderType);
           

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */



  }
  checkValueKeyup(event, obj) {
    obj.value = event.target.value;
    if (obj.key == "Kod pocztowy") {
      var zipcode = event.target.value;
      if (zipcode.length == 2 && event.keyCode !== 8) {
        obj.value = zipcode.substring(0, 2) + "-" + zipcode.slice(3, 6);
      }
      if (zipcode.length == 6) {
        if (zipcode.indexOf("-") === -1) {
          obj.value = zipcode.substring(0, 2) + "-" + zipcode.slice(3, 6);
        }
      }
    } else if (obj.key == "PESEL") {
      this.phPeselInvalid = false;
      let val: string = event.target.value.replace(/[^0-9]+/gi, '');
      event.target.value = val;
      let str = val.slice(9, 10);
      let length = val.length;
      if (length >= 10) {
        if (str == "0" || str == "2" || str == "4" || str == "6" || str == "8") {
          if (this.selectedOwnerTypeData.length == 3) {
            this.selectedOwnerTypeData.push({ "key": "Nazwisko rodowe", "value": "" });
          }
        } else {
          this.selectedOwnerTypeData = this.selectedOwnerTypeData.filter(item => item.key != "Nazwisko rodowe");
        }
      } else {
        this.selectedOwnerTypeData = this.selectedOwnerTypeData.filter(item => item.key != "Nazwisko rodowe");
      }
    }
    else if (obj.key == "Email") {
      this.emailInvalid = false;
     }
    else if (obj.key == "Telefon") {
      this.phoneInvalid = true;
     }
    else if (obj.key == "Miasto") { }
    else if (obj.key == "Ulica") { }
    else if (obj.key == "Nr domu" || obj.key == "Nr mieszkania") { }
  }
  validateVin(event) {
    let value = event.target.value;
    value = value.replace(/[^0-9,A-H,J-N,P,R-Z,a-h,j-n,p,r-z]+/gi, '');
    event.target.value = value;
    this.vin = value;
  }
  validateLicPlate(event) {
    let value = event.target.value;
    value = value.replace(/[^0-9,A-Z,a-z]+/gi, '');
    event.target.value = value;
    this.licensePlateNo = value;
  }
  checkValueOnBlur(event, key) {
  }
  validateZipCode(resZip, mailZip) {
    this.cislService.getDataFromCislZipCodeData(resZip).subscribe(data => this.serializeZipCodeRes(data, resZip, mailZip));
  }
  serializeZipCodeRes(data, resZip, mailZip) {
    if (data.options) {
      if (data.options[0].value === resZip) {
        if (this.isMailingAddSame == 'false') {
          this.cislService.getDataFromCislZipCodeData(mailZip).subscribe(data => this.serializeZipCodeMail(data, mailZip));
        } else {
          this.allFieldsValid = true;
        }
      } else {
        this.allFieldsValid = false;
      }
    } else {
      this.allFieldsValid = false;
    }
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
  omit_special_char_name(event) {
    let k;
    let val = false;
    k = event.charCode;
    if ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 0 || k >= 128) {
      return true;
    } else {
      return false;
    }
  }
  titleCaseName(event) {
    event.target.value = this.titleConvert.titleCase(event.target.value);
  }
  validateSpace(event) {
    let value = event.target.value;
    event.target.value = value.replace(/  +/g, ' ');
  }


  serializeZipCodeMail(data, mailZip) {
    if (data.options) {
      if (data.options[0].value === mailZip) {
        this.allFieldsValid = true;
      } else {
        this.allFieldsValid = false;
      }
    } else {
      this.allFieldsValid = false;
    }
  }
  resetPersonalDetails(obj){
    for (let field of obj) {
      field.value = "";
    }
  }
  resetContactDetails() {
    for (let contact of this.selectedOwnerTypeContact) {
      contact.value = "";
    }
  }
  resetAddrDetails() {
    for (let address of this.selectedOwnerTypeAddrRes) {
      address.value = "";
    }
    for (let address of this.selectedOwnerTypeAddrMail) {
      address.value = "";
    }
  }
  updateOwnerDetaileToGet(name: string): void {
    this.ownerDetailsToGet = [];
    for (let i = 0; i < this.avilableOwnerList.length; i++) {
      if (this.avilableOwnerList[i] !== name) {
        var obj = { "key": this.avilableOwnerList[i] == "mainOwner" ? "main owner" : (this.avilableOwnerList[i] == "coOwner1" ? "owner 1" : "owner 2"), "value": this[this.avilableOwnerList[i]], "flag": this.nonPHAddrCheck[this.avilableOwnerList[i]], "addr": this[this.avilableOwnerList[i] + "AddrRes"] };
        if (this.avilableOwnerList[i] == 'mainOwner') {
          obj['contact'] = [{ "key": this.mainOwnerContact[0].key, "value": this.mainOwnerContact[0].value },
          { "key": this.mainOwnerContact[1].key, "value": this.mainOwnerContact[1].value }]
        }
        this.ownerDetailsToGet.push(obj);
      }
    }
  }
  validateName(event): any {
    return this.validator.omitSpecialChar(event);
  }
  validatePasel(event): any {
    return this.validator.acceptOnlyNumbers(event);
  }
  checkPaselOwner(event): void {
    this.selectedOwnerTypeData.iswomen = this.validator.validatePasel(event, false);
  }
  openDropDown(ele: Element): void {
    ele.classList.add('is-opened');
  }
  getAllBankList(): void {
    if (this.setupSession == 'cessionNo' || this.setupSession == '') {
      this.bankList = [{ city: 'City 1' }, { city: 'City 2' }, { city: 'City 3' }, { city: 'City 4' }];
    }
  }
  addClass(event): void {
  }
  removeClass(event): void {
    if (event.target.value == "") {
      event.target.classList.remove('is-filled');
    }
  }
  checkAllFieldValidations():any {
    var phPersonData = this.checkPHPersonalData();
    var phContactData = this.checkContactData(this.selectedOwnerTypeContact);
    var phAddrResData = this.checkAddrData(this.selectedOwnerTypeAddrRes,'res');
    var phAddrMailData = phAddrResData;
    if (this.isMailingAddSame == 'false') {
      phAddrMailData = this.checkAddrData(this.selectedOwnerTypeAddrMail,'mail');
    } else if (this.isMailingAddSame == '' || this.isMailingAddSame === undefined) {
      return false;
    }
    if (this.ownerDetailsToGet.length > 0) {
      var nonPHData = this.checkNonPHData();
    }
    var licensePlate = this.checkLicensePlateNo();
    var vin = this.checkVin();
    var carDamage = this.checkCarDamage();
    var noofKeys = this.noOfKeys == "" ? false : true;

    var validationCheck = { 'phPersonData': phPersonData, 'phContactData': phContactData, 'phAddrResData': phAddrResData, 'phAddrMailData': phAddrMailData, 'nonPHData': nonPHData, 'licensePlate': licensePlate, 'vin': vin, 'carDamage': carDamage, 'noofKeys': noofKeys };
    var keys = Object.keys(validationCheck);
    for (var i = 0; i < keys.length; i++) {
      if (validationCheck[keys[i]] == false) {
        return false;
      }
    }
    return true;
  }
  checkVin() {
    if (this.vin == "") {
      return false;
    } else {
      return true;
    }
  }
  checkLicensePlateNo() {
    if (this.licensePlate == false) {
      if (this.licensePlateNo == "") {
        return false;
      } else {
        return true;
      }
    } else {
      this.licensePlateNo = "";
      return true;
    }
  }
  checkCarDamage() {
    if (this.isCarDamaged == "damagedYes") {
      if (this.damagedDesc == "") {
        return false;
      } else {
        return true;
      }
    } else if (this.isCarDamaged == "damagedNo") {
      return true;
    } else {
      return false;
    }
  }
  checkPHPersonalData(): boolean {
    if (this.policyHolderType == 'other') {
      for (var i = 0; i < this.selectedOwnerTypeData.length; i++) {
        if (this.selectedOwnerTypeData[i].key == "PESEL") {
          if (!this._validateServices.validatePesel(this.selectedOwnerTypeData[i].value) || !this.checkDuplicatePesel(this.selectedOwnerTypeData[i].value)) {
            return false;
          }
        } else if (this.selectedOwnerTypeData[i].key == "REGON") {
          if (!this._validateServices.validateRegOn(this.selectedOwnerTypeData[i].value)) {
            return false;
          }
        }
        else {
          if (this.selectedOwnerTypeData[i].value == "") {
            return false;
          }
        }
      }
      return true;
    } else {
      return true;
    }
  }
  checkDuplicatePesel(pesel): boolean {
    for (var i = 0; i < this.pesels.length; i++) {
      if (pesel == this.pesels[i]) {
        return false;
      }
    }
    return true;
  }
  checkContactData(contactData): boolean {
    if (contactData != undefined) {
      if (this.checkTelephone(contactData[0].value) && this.checkEmail(contactData[1].value)) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  checkTelephone(value): boolean {
    let re = /^(\+?\d+)$/g;
    if (value != '') {
      if (re.test(value)) {
        if (value.length < 9) {
          this.phoneInvalid = true;
          return false;
        } else {
          this.phoneInvalid = false;
          return true;
        }
      } else {
        this.phoneInvalid = true;
        return false;
      }
    } else {
      this.phoneInvalid = false;
      return false;
    }

  }
  checkEmailBlur(key, value){
    if(key =='Email'){
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(value)) {
        this.emailInvalid = true;
      }
    }
  }
  checkEmail(value): boolean {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value != '') {
      if (re.test(value)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  checkResZipBlur(key, value){
    if(key == 'Kod pocztowy'){
      if(value.length < 6 && value != ""){
        this.resZipInvalid = true;
      }
    }
  }
  checkMailZipBlur(key, value) {
    if(key == 'Kod pocztowy'){
      if(value.length < 6 && value != ""){
        this.mailZipInvalid = true;
      }
    }
  }
  checkAddrData(addrData, type): boolean {
    for (var i = 0; i < addrData.length; i++) {
      if (addrData[i].key != 'Nr mieszkania') {
        if (addrData[i].key == 'Kod pocztowy') {
          if (addrData[i].value.length < 6 && addrData[i].value != "") {
            return false;
          }else if(addrData[i].value == ""){
            return false;
          }else{
            this[type+'ZipInvalid'] = false;
          }
        } else {
          if (addrData[i].value == "") {
            return false;
          }
        }
      }
    }
    return true;
  }
  checkNonPHData(): boolean {
    var nonPolicyHolders = [];
    for (var i = 0; i < this.ownerDetailsToGet.length; i++) {
      if (this.ownerDetailsToGet[i].key == "main owner") {
        nonPolicyHolders.push("mainOwner");
      } else if (this.ownerDetailsToGet[i].key == "owner 1") {
        nonPolicyHolders.push("coOwner1");
      } else {
        nonPolicyHolders.push("coOwner2");
      }
    }
    this.nonPH = nonPolicyHolders;
    for (var i = 0; i < nonPolicyHolders.length; i++) {
      if (this.nonPHAddrCheck[nonPolicyHolders[i]] == 'no') {
        if (!this.checkContactData(this[nonPolicyHolders[i] + "Contact"]) || !this.checkAddrData(this[nonPolicyHolders[i] + "AddrRes"], 'res')) {
          return false;
        }
      }
    }
    return true;
  }
  hideErrorPopup(data: any) {
    this.hasErrors = false;
  }
  validateAll(){
    this.nextClicked = true;
    setTimeout(() => {
				this.savePolicyHolderData();
			}, 10);    
  }
  savePolicyHolderData() {
    if(this.allFieldsValid && !this.isMarketingConsentChecked) {  
      this.disabledNext = true;    
      if (this.phSessionData != null && this.phSessionData != undefined) {
      if (this.phSessionData.policyHolderType != this.policyHolderType) {
        var phType = this.phSessionData.policyHolderType;
        this.cislService.deleteDriverRole(this.contractId, this.partyIds[this.phSessionData.policyHolderType], this.roleIds[this.phSessionData.policyHolderType]).subscribe();
        this.roleIds[phType] = "";
        if (this.checkAllFieldValidations()) {
          if (this.roleIds[this.policyHolderType] != '') {
            this.cislService.updatePH(this.contractId, this.partyIds[this.policyHolderType], this.roleIds[this.policyHolderType]).subscribe(data => this.serializePHdatapost(data, 'update'));
          } else {
            if (this.policyHolderType != "other") {
              this.cislService.getPolicyHolderRoleIdFromCisl(this.contractId, this.partyIds[this.policyHolderType]).subscribe(data => this.serializePHdatapost(data, 'post'));
            } else {
              var requestParams = {
                "firstName": this.selectedOwnerTypeData[0].value,
                "lastName": this.selectedOwnerTypeData[1].value,
                "maidenName": "",
                "peselid": this.selectedOwnerTypeData[2].value,
                "typeOfOwnerShip": "PP",
                "roleName": "PH",
                "companyName": "",
                "regon": "",
                "mainOwner": false
              };
              this.cislService.saveOwnerDetails(requestParams, this.contractId).subscribe(data => this.serializePHdatapostOther(data));
            }
          }
        }
      } else {
        if (this.checkAllFieldValidations()) {
          if (this.roleIds[this.policyHolderType] != '') {
            this.cislService.updatePH(this.contractId, this.partyIds[this.policyHolderType], this.roleIds[this.policyHolderType]).subscribe(data => this.serializePHdatapost(data, 'update'));
          } else {
            if (this.policyHolderType != "other") {
              this.cislService.getPolicyHolderRoleIdFromCisl(this.contractId, this.partyIds[this.policyHolderType]).subscribe(data => this.serializePHdatapost(data, 'post'));
            } else {
              var requestParams = {
                "firstName": this.selectedOwnerTypeData[0].value,
                "lastName": this.selectedOwnerTypeData[1].value,
                "maidenName": "",
                "peselid": this.selectedOwnerTypeData[2].value,
                "typeOfOwnerShip": "PP",
                "roleName": "PH",
                "companyName": "",
                "regon": "",
                "mainOwner": false
              };
              this.cislService.saveOwnerDetails(requestParams, this.contractId).subscribe(data => this.serializePHdatapostOther(data));
            }
          }
        }
      }
    }
    else {
      if (this.checkAllFieldValidations()) {
        if (this.roleIds[this.policyHolderType] != '') {
          this.cislService.updatePH(this.contractId, this.partyIds[this.policyHolderType], this.roleIds[this.policyHolderType]).subscribe(data => this.serializePHdatapost(data, 'update'));
        } else {
          if (this.policyHolderType != "other") {
            this.cislService.getPolicyHolderRoleIdFromCisl(this.contractId, this.partyIds[this.policyHolderType]).subscribe(data => this.serializePHdatapost(data, 'post'));
          } else {
            var requestParams = {
              "firstName": this.selectedOwnerTypeData[0].value,
              "lastName": this.selectedOwnerTypeData[1].value,
              "maidenName": "",
              "peselid": this.selectedOwnerTypeData[2].value,
              "typeOfOwnerShip": "PP",
              "roleName": "PH",
              "companyName": "",
              "regon": "",
              "mainOwner": false
            };
            this.cislService.saveOwnerDetails(requestParams, this.contractId).subscribe(data => this.serializePHdatapostOther(data));
          }
        }
      }
    }
    } else {
      this.hasErrors = true;
      document.getElementsByTagName("error")[0].parentElement.scrollIntoView();
    }    
  
  }
  /*serializeDeletPHRole(data, phType) 
    this.roleIds[phType]="";
    if(this.checkAllFieldValidations()){
          if(this.roleIds[this.policyHolderType] != '') {
            this.cislService.updatePH(this.contractId, this.partyIds[this.policyHolderType], this.roleIds[this.policyHolderType]).subscribe(data => this.serializePHdatapost(data,'update'));
          }else {
            if(this.policyHolderType != "other") {
                this.cislService.getPolicyHolderRoleIdFromCisl(this.contractId,this.partyIds[this.policyHolderType]).subscribe(data => this.serializePHdatapost(data,'post'));
            } else {
                var requestParams = {
                                    "firstName":this.selectedOwnerTypeData[0].value,
                                    "lastName":this.selectedOwnerTypeData[1].value,
                                    "maidenName":"",
                                    "peselid":this.selectedOwnerTypeData[2].value,
                                    "typeOfOwnerShip":"PP",
                                    "roleName":"PH",
                                    "companyName":"",
                                    "regon":"",
                                    "mainOwner":false
                                    };
                this.cislService.saveOwnerDetails(requestParams, this.contractId).subscribe(data => this.serializePHdatapostOther(data));
            } 
        }     
      }
  }*/
  serializePHdatapostOther(phData) {
    this.partyIds['other'] = phData.partyId;
    this.roleIds['other'] = phData.roleId;
    this.postAddressData();
  }
  serializePHdatapost(phData, checkUpdatePost) {
    if (checkUpdatePost == 'post') {
      this.roleIds[this.policyHolderType] = phData.self;
    }
    this.postAddressData();
  }
  postAddressData() {
    var requestParamsAddresResPH = {
      "town": this.selectedOwnerTypeAddrRes[1].value,
      "zipCode": this.selectedOwnerTypeAddrRes[0].value,
      "street": this.selectedOwnerTypeAddrRes[2].value,
      "houseNumber": this.selectedOwnerTypeAddrRes[3].value,
      "flatNumber": this.selectedOwnerTypeAddrRes[4].value,
      "addressType": 'CH', "countryCode": 'PL',
      "partyId": this.partyIds[this.policyHolderType]
    };
    var requestParamsAddressMailPH = {};

    if (this.isMailingAddSame == 'false') {
      requestParamsAddressMailPH = {
        "town": this.selectedOwnerTypeAddrMail[1].value,
        "zipCode": this.selectedOwnerTypeAddrMail[0].value,
        "street": this.selectedOwnerTypeAddrMail[2].value,
        "houseNumber": this.selectedOwnerTypeAddrMail[3].value,
        "flatNumber": this.selectedOwnerTypeAddrMail[4].value,
        "addressType": 'CC', "countryCode": 'PL',
        "partyId": this.partyIds[this.policyHolderType]
      };
    } else {
      requestParamsAddressMailPH = {
        "town": this.selectedOwnerTypeAddrRes[1].value,
        "zipCode": this.selectedOwnerTypeAddrRes[0].value,
        "street": this.selectedOwnerTypeAddrRes[2].value,
        "houseNumber": this.selectedOwnerTypeAddrRes[3].value,
        "flatNumber": this.selectedOwnerTypeAddrRes[4].value,
        "addressType": 'CC', "countryCode": 'PL',
        "partyId": this.partyIds[this.policyHolderType]
      };
    }
    if (this.addressIds[this.policyHolderType].length >= 1) {
      for (var obj of this.addressIds[this.policyHolderType]) {
        if (obj.CH != undefined) {
          requestParamsAddresResPH['addressSelf'] = obj.CH;
        }
        if (obj.CC != undefined) {
          requestParamsAddressMailPH['addressSelf'] = obj.CC;
        }
      }
    }
    var requestParamsContactPH = {
      "phoneNumber": this.selectedOwnerTypeContact[0].value,
      "email": this.selectedOwnerTypeContact[1].value,
      "partySelf": this.partyIds[this.policyHolderType]
    };
    if (this.contactIds[this.policyHolderType]['emailSelf'] != '' && this.contactIds[this.policyHolderType]['phoneSelf'] != '') {
      requestParamsContactPH['emailSelf'] = this.contactIds[this.policyHolderType]['emailSelf'];
      requestParamsContactPH['phoneNumberSelf'] = this.contactIds[this.policyHolderType]['phoneSelf'];
      this.contactHttpMethod = 'put';
    } else {
      if (this.policyHolderType == 'mainOwner' && (this.contactIds['mainOwner']['emailSelf'] != '' && this.contactIds['mainOwner']['phoneSelf'] != '')) {
        requestParamsContactPH['emailSelf'] = this.contactIds['mainOwner']['emailSelf'];
        requestParamsContactPH['phoneNumberSelf'] = this.contactIds['mainOwner']['phoneSelf'];
        this.contactHttpMethod = 'put';
      } else {
        this.contactHttpMethod = 'post';
      }
    }
    var requestParamsAddress = [];
    var requestParamsContact = [];
    requestParamsAddress.push(requestParamsAddresResPH);
    requestParamsAddress.push(requestParamsAddressMailPH);
    requestParamsContact.push(requestParamsContactPH);
    var nonPolicyHolders = [];
    var requestParamsNonPH = [];
    var mainOwner = {};
    var coOwner1 = {};
    var coOwner2 = {};
    for (var i = 0; i < this.ownerDetailsToGet.length; i++) {
      if (this.ownerDetailsToGet[i].key == "main owner") {
        nonPolicyHolders.push("mainOwner");
        var rqMainOwnerContactNonPH = {};
        var rqMainOwnerAddrNonPH = {};
        if (this.nonPHAddrCheck['mainOwner'] == 'no') {
          rqMainOwnerAddrNonPH = {
            "town": this.mainOwnerAddrRes[1].value,
            "zipCode": this.mainOwnerAddrRes[0].value,
            "street": this.mainOwnerAddrRes[2].value,
            "houseNumber": this.mainOwnerAddrRes[3].value,
            "flatNumber": this.mainOwnerAddrRes[4].value,
            "addressType": 'CH', "countryCode": 'PL',
            "partyId": this.partyIds['mainOwner']
          };
        } else {
          rqMainOwnerAddrNonPH = {
            "town": this.selectedOwnerTypeAddrRes[1].value,
            "zipCode": this.selectedOwnerTypeAddrRes[0].value,
            "street": this.selectedOwnerTypeAddrRes[2].value,
            "houseNumber": this.selectedOwnerTypeAddrRes[3].value,
            "flatNumber": this.selectedOwnerTypeAddrRes[4].value,
            "addressType": 'CH', "countryCode": 'PL',
            "partyId": this.partyIds['mainOwner']
          };
        }
        if (this.addressIds['mainOwner'].length >= 1) {
          rqMainOwnerAddrNonPH['addressSelf'] = this.addressIds['mainOwner'][0]['CH'];
        }
        requestParamsAddress.push(rqMainOwnerAddrNonPH);
        var reqNonPHMainOwnerContact = [{
          "phoneNumber": this.mainOwnerContact[0].value,
          "email": this.mainOwnerContact[1].value,
          "partySelf": this.partyIds['mainOwner']
        }];
        var mainOwnerContHttp = '';
        if (this.contactIds['mainOwner']['phoneSelf'] != "") {
          reqNonPHMainOwnerContact[0]['phoneNumberSelf'] = this.contactIds['mainOwner']['phoneSelf'];
          reqNonPHMainOwnerContact[0]['emailSelf'] = this.contactIds['mainOwner']['emailSelf'];
          mainOwnerContHttp = 'put';
        } else {
          mainOwnerContHttp = 'post';
        }
      } else if (this.ownerDetailsToGet[i].key == "owner 1") {
        nonPolicyHolders.push("coOwner1");
        var rqCoOwner1ContactNonPH = {};
        var rqCoOwner1AddrNonPH = {};
        if (this.nonPHAddrCheck['coOwner1'] == 'no') {
          rqCoOwner1AddrNonPH = {
            "town": this.coOwner1AddrRes[1].value,
            "zipCode": this.coOwner1AddrRes[0].value,
            "street": this.coOwner1AddrRes[2].value,
            "houseNumber": this.coOwner1AddrRes[3].value,
            "flatNumber": this.coOwner1AddrRes[4].value,
            "addressType": 'CH', "countryCode": 'PL',
            "partyId": this.partyIds['coOwner1']
          };
        } else {
          rqCoOwner1AddrNonPH = {
            "town": this.selectedOwnerTypeAddrRes[1].value,
            "zipCode": this.selectedOwnerTypeAddrRes[0].value,
            "street": this.selectedOwnerTypeAddrRes[2].value,
            "houseNumber": this.selectedOwnerTypeAddrRes[3].value,
            "flatNumber": this.selectedOwnerTypeAddrRes[4].value,
            "addressType": 'CH', "countryCode": 'PL',
            "partyId": this.partyIds['coOwner1']
          };
        }
        if (this.addressIds['coOwner1'].length >= 1) {
          rqCoOwner1AddrNonPH['addressSelf'] = this.addressIds['coOwner1'][0]['CH'];
        }
        requestParamsAddress.push(rqCoOwner1AddrNonPH);
      } else {
        nonPolicyHolders.push("coOwner2");
        var rqCoOwner2ContactNonPH = {};
        var rqCoOwner2AddrNonPH = {};
        if (this.nonPHAddrCheck['coOwner2'] == 'no') {
          rqCoOwner2AddrNonPH = {
            "town": this.coOwner2AddrRes[1].value,
            "zipCode": this.coOwner2AddrRes[0].value,
            "street": this.coOwner2AddrRes[2].value,
            "houseNumber": this.coOwner2AddrRes[3].value,
            "flatNumber": this.coOwner2AddrRes[4].value,
            "addressType": 'CH', "countryCode": 'PL',
            "partyId": this.partyIds['coOwner2']
          };
        } else {
          rqCoOwner2AddrNonPH = {
            "town": this.selectedOwnerTypeAddrRes[1].value,
            "zipCode": this.selectedOwnerTypeAddrRes[0].value,
            "street": this.selectedOwnerTypeAddrRes[2].value,
            "houseNumber": this.selectedOwnerTypeAddrRes[3].value,
            "flatNumber": this.selectedOwnerTypeAddrRes[4].value,
            "addressType": 'CH', "countryCode": 'PL',
            "partyId": this.partyIds['coOwner2']
          };
        }
        if (this.addressIds['coOwner2'].length >= 1) {
          rqCoOwner2AddrNonPH['addressSelf'] = this.addressIds['coOwner2'][0]['CH'];
        }
        requestParamsAddress.push(rqCoOwner2AddrNonPH);
      }
    }
    var filteredReqPost = requestParamsAddress.filter(item => item.addressSelf == undefined);
    requestParamsAddress = requestParamsAddress.filter(item => item.addressSelf != undefined);
    if (filteredReqPost.length > 0 && requestParamsAddress.length > 0) {
      this.cislService.postPolicyHolerAddress(this.contractId, filteredReqPost, 'post').subscribe(data => this.serializeFilterdAddrData(data, requestParamsAddress, requestParamsContact, reqNonPHMainOwnerContact, mainOwnerContHttp));
    } else if (filteredReqPost.length > 0 && requestParamsAddress.length < 1) {
      this.cislService.postPolicyHolerAddress(this.contractId, filteredReqPost, 'post').subscribe(data => this.serializePHaddressData(data, requestParamsContact, reqNonPHMainOwnerContact, mainOwnerContHttp));
    } else {
      this.cislService.postPolicyHolerAddress(this.contractId, requestParamsAddress, 'put').subscribe(data => this.serializePHaddressData(data, requestParamsContact, reqNonPHMainOwnerContact, mainOwnerContHttp));
    }
  }
  serializeFilterdAddrData(phData, requestParamsAddress, requestParamsContact, reqNonPHMainOwnerContact, mainOwnerContHttp) {
    var keys = Object.keys(this.partyIds);
    for (var i = 0; i < phData.length; i++) {
      for (var j = 0; j < keys.length; j++) {
        if (phData[i].partyId == this.partyIds[keys[j]]) {
          if (phData[i].addressType == "CH") {
            this.addressIds[keys[j]].push({ "CH": phData[i].addressSelf });
          }
          if (phData[i].addressType == "CC") {
            this.addressIds[keys[j]].push({ "CC": phData[i].addressSelf });
          }
        }
      }
    }
    this.cislService.postPolicyHolerAddress(this.contractId, requestParamsAddress, 'put').subscribe(data => this.serializePHaddressData(data, requestParamsContact, reqNonPHMainOwnerContact, mainOwnerContHttp));
  }
  serializePHaddressData(phData, requestParamsContact, reqNonPHMainOwnerContact, mainOwnerContHttp) {
    var keys = Object.keys(this.partyIds);
    for (var i = 0; i < phData.length; i++) {
      for (var j = 0; j < keys.length; j++) {
        if (phData[i].partyId == this.partyIds[keys[j]]) {
          if (phData[i].addressType == "CH") {
            this.addressIds[keys[j]].push({ "CH": phData[i].addressSelf });
          }
          if (phData[i].addressType == "CC") {
            this.addressIds[keys[j]].push({ "CC": phData[i].addressSelf });
          }
        }
      }
    }
    if (reqNonPHMainOwnerContact != undefined) {
      this.cislService.postorUpdateContactDetails(reqNonPHMainOwnerContact, this.contractId, mainOwnerContHttp).subscribe(data => this.serializeNonPHMainOWnerContact(data, requestParamsContact, mainOwnerContHttp));
    } else {
      if (this.policyHolderType == 'mainOwner' && (this.contactIds['mainOwner']['emailSelf'] != '' && this.contactIds['mainOwner']['phoneSelf'] != '')) {
        this.contactHttpMethod = 'put';
      }
      this.cislService.postorUpdateContactDetails(requestParamsContact, this.contractId, this.contactHttpMethod).subscribe(data => this.serializeNonPHdata(data, this.contactHttpMethod));
    }
  }
  serializeNonPHMainOWnerContact(phData, requestParamsContact, postOrUpdate) {
    if (postOrUpdate == 'post') {
      this.contactIds['mainOwner']['phoneSelf'] = phData[0].phoneNumberSelf;
      this.contactIds['mainOwner']['emailSelf'] = phData[0].emailSelf;
    }
    if (this.policyHolderType == 'mainOwner' && (this.contactIds['mainOwner']['emailSelf'] != '' && this.contactIds['mainOwner']['phoneSelf'] != '')) {
      this.contactHttpMethod = 'put';
    }
    this.cislService.postorUpdateContactDetails(requestParamsContact, this.contractId, this.contactHttpMethod).subscribe(data => this.serializeNonPHdata(data, this.contactHttpMethod));
  }
  serializeNonPHdata(phData, postOrUpdate) {
    if (postOrUpdate == 'post') {
      for (var i = 0; i < phData.length; i++) {
        for (var key of Object.keys(this.partyIds)) {
          if (phData[i].partySelf == this.partyIds[key]) {
            this.contactIds[key]['phoneSelf'] = phData[i].phoneNumberSelf;
            this.contactIds[key]['emailSelf'] = phData[i].emailSelf;
          }
        }
      }
    }
    var carusageData = JSON.parse(sessionStorage.getItem("carusage"));
    var cardetailsData = JSON.parse(sessionStorage.getItem("carDetails"));
    var driverData = JSON.parse(sessionStorage.getItem("driverData"));
    var propIdParamsUpdate = {
      "licensePlateNumber": this.licensePlate == true ? "" : this.licensePlateNo,
      "usage": carusageData.purposeValue,
      "distance": carusageData.mileage.replace(/\s/g, ''),
      "rightHandedDrive": cardetailsData.sideofwheel == "Left" ? false : true,
      "recentImport": carusageData.carImported == "no" ? false : true,
      "garageLocation": carusageData.zipCode,
      "vehicleBrand": cardetailsData.carBrand,
      "vehicleModel": cardetailsData.carModel,
      "buildYear": cardetailsData.prodYear,
      "firstRegistrationDate": carusageData.firstRegistration + "-01-01",
      "expertCatalogIdentificationNumber": cardetailsData.carVersionId,
      "purchaseDate": carusageData.carOwnedDate + "-01-01",
      "countryCode": carusageData.countryCode == undefined ? "" : carusageData.countryCode,
      "power": cardetailsData.carEnginePower == "Choose" ? "" : cardetailsData.carEnginePower,
      "cubicCapacity": cardetailsData.carEngineSize == "Choose" ? "" : cardetailsData.carEngineSize,
      "modelDetail": cardetailsData.carVersionName,
      "fuelType": cardetailsData.fuelType,
      "bodyType": cardetailsData.carBody,
      "numberOfDoors": cardetailsData.carVersionDoors,
      "antiTheftDevice": cardetailsData.antiTheftValues.toString().substring(1),
      "placeOfParking": carusageData.parkingValues,
      "yearlyMilageAbroad": carusageData.abroadValue,
      "yearlyMilage": carusageData.plannedMilageValue,
      "vehicleIdentificationNumber": this.vin,
      "majorExistingDamages": this.isCarDamaged == "damagedYes" ? true : false,
      "existingDamageDescription": this.damagedDesc,
      "numberOfKeys": this.noOfKeys,
      "youngDriver": driverData.driverHasKids,
      "youngDriverBirthYear": driverData.driverKidBirthYear == "Choose" ? "" : driverData.driverKidBirthYear
    };
    this.cislService.updateProperty(this.contractId, this.propertyId, propIdParamsUpdate).subscribe(data => this.serializePropData(data));
  }
  serializePropData(data) {
    // this.setSessionData();
    this.saveQuoteService.autoSavePageData();
    this.sendMarketingConsentToCisl();
    this.router.navigateByUrl('/summary');
  }
  sendEmail() {
    this.cislService.sendEmail(this.contractId, this.policyId).subscribe(data => this.serializeEmail(data));
  }
  serializeEmail(data) {
  }
  setSessionData() {
    var phData = {
      "policyHolderType": this.policyHolderType,
      "selectedOwnerTypeData": this.selectedOwnerTypeData,
      "selectedOwnerTypeContact": this.selectedOwnerTypeContact,
      "selectedOwnerTypeAddrRes": this.selectedOwnerTypeAddrRes,
      "selectedOwnerTypeAddrMail": this.selectedOwnerTypeAddrMail,
      "isMailingAddSame": this.isMailingAddSame,
      "nonPHAddrCheck": this.nonPHAddrCheck,
      "mainOwnerAddrRes": this.mainOwnerAddrRes,
      "mainOwnerContact": this.mainOwnerContact,
      "coOwner1AddrRes": this.coOwner1AddrRes,
      "coOwner2AddrRes": this.coOwner2AddrRes,
      "licensePlateNo": this.licensePlateNo,
      "licensePlate": this.licensePlate,
      "propertyId": this.propertyId,
      "vin": this.vin,
      "addressIds": this.addressIds,
      "contactIds": this.contactIds,
      "roleIds": this.roleIds,
      "partyIds": this.partyIds,
      "isCarDamaged": this.isCarDamaged,
      "noOfKeys": this.noOfKeys,
      "setupSession": this.setupSession,
      "nonPH": this.nonPH,
      "damagedDesc": this.damagedDesc,
      "consentsArr": this.consentsArr,
      "questionCatelogueId": this.questionCatelogueId,
      "selectedAllConsent": this.selectedAllConsent,
      "isFromRestore" : false
    };
    sessionStorage.setItem("phData", JSON.stringify(phData));
    this.applicationData.currentPageId = this.saveQuoteService.currentPageId;
    if (this.policyHolderType == "mainOwner") {
      this.applicationData.owner.email = this.selectedOwnerTypeContact[1].value;
      this.applicationData.owner.emailChannelId = this.contactIds['mainOwner']['emailSelf'];
      this.applicationData.owner.phone = this.selectedOwnerTypeContact[0].value;
      this.applicationData.owner.phoneChannelId = this.contactIds['mainOwner']['phoneSelf'];      
      sessionStorage.setItem("Application", JSON.stringify(this.applicationData));
    }
  }
  /* checkonPaste(event, key){
    this._validateServices.checkonPaste(event, key);
  }*/

  /* Marketing consents */
  getMarketingConsentsFromCisl() {
    this.cislService.getMarketingConsentsFromCisl(this.contractId, this.consentsId).subscribe(data => { this.serializeMarketingConsents(data) });
  }
  serializeMarketingConsents(data) {
    this.questionCatelogueId = data[0].questionsCatalogueId;
    this.consentsArr = data[0].decisionQuestion;
  }
  serializePutMarketingConsents(data) {
    if (this.phSessionData == null || this.phSessionData == undefined) {
      this.sendEmail();
    }
  }
  setConsents(data) {
    this.isMarketingConsentChecked = !(data.IsConsentValid);
    this.selectedAllConsent = data.SelectedAllConsents;
    this.consentsArr = data.ConsentArray;
  }
  sendMarketingConsentToCisl() {
    this.cislService.sendMarketingConsentsToCisl(this.contractId, this.questionCatelogueId, this.consentsArr).subscribe(data => { this.serializePutMarketingConsents(data) });
  }

  clickBackButton(){
    this.saveQuoteService.autoSavePageData();
    this.router.navigateByUrl('/configuration');
  }

  trackcardamage(event){
    
  var damageStatus=event.target.value;

  var damageStatusString:string;

  if (damageStatus=="damagedYes") {damageStatusString="Yes";}

  else if (damageStatus=="damagedNo"){damageStatusString="No";}

  

/*Analytics tracking for car damage status*/
        /*if(window && window.om.core.tracking.addSPAEvent) {
            window.om.core.tracking.addSPAEvent("carDamageStatus", "click", {"carDamageStatus": damageStatusString}); // add event to the datalayer
            window._satellite.track("carDamageStatus"); // trigger dynamic tag manager
        } */
        /*Analytics tracking for car car damage status end */

          	 		/* ********************DO-NOT-TOUCH***************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.quoteData.carDamageStatus', damageStatusString);
            

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */


    

  }
}

