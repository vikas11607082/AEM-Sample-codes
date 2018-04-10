import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
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
  templateUrl: '../html/quote.carownerdetails.component.html',
  entryComponents: [ErrorPopUp, CallPopUp]
})
export class CarOwnerDetailsComponent {

  constructor(private cislService: CislService, private router: Router, private titleConvert: CamelCaseConvert,
    private saveQuoteService: SaveQuoteService, private _saveButtonShowHide: SaveButtonHideShowService) { }

  public nextDisa: boolean = false;
  public hasErrors: boolean = false;
  public mainOwner: string = "PrivatePerson";
  mainOwnerData = {
    type: '',
    firstName: '',
    surName: '',
    peselId: '',
    familyName: '',
    regOn: '',
    companyName: '',
    companyRegOn: '',
    bankName: '',
    bankRegOn: '',
    leaseName: '',
    leaseRegOn: '',
    partyId: '',
    roleId: '',
    email: '',
    phone: '',
    phoneChannelId: '',
    emailChannelId: '',
    consent: [],
    selectAllConsent: false,
    questionCatelogueId: ""

  };
  coOwnerData = {
    type: '',
    firstName: '',
    surName: '',
    peselId: '',
    familyName: '',
    regOn: '',
    companyName: '',
    companyRegOn: '',
    bankName: '',
    bankRegOn: '',
    leaseName: '',
    leaseRegOn: '',
    partyId: '',
    roleId: ''
  };
  coOwner2Data = {
    type: '',
    firstName: '',
    surName: '',
    peselId: '',
    familyName: '',
    regOn: '',
    companyName: '',
    companyRegOn: '',
    bankName: '',
    bankRegOn: '',
    leaseName: '',
    leaseRegOn: '',
    partyId: '',
    roleId: ''
  };
  scrollEle: any;
  errors: any;
  nextClicked: boolean = false;
  errMOPFN: boolean = false;
  errMOPSN: boolean = false;
  errMOPP: boolean = false;
  errMOPFamN: boolean = false;
  errMOSFN: boolean = false;
  errMOSSN: boolean = false;
  errMOSP: boolean = false;
  errMOSFamN: boolean = false;
  errMOSRegon: boolean = false;
  errMOCN: boolean = false;
  errMOCRegon: boolean = false;
  errMOBN: boolean = false;
  errMOBRegon: boolean = false;
  errMOLN: boolean = false;
  errMOLRegon: boolean = false;
  errCOPFN: boolean = false;
  errCOPSN: boolean = false;
  errCOPP: boolean = false;
  errCOPFamN: boolean = false;
  errCOSFN: boolean = false;
  errCOSSN: boolean = false;
  errCOSP: boolean = false;
  errCOSFamN: boolean = false;
  errCOSRegon: boolean = false;
  errCOCN: boolean = false;
  errCOCRegon: boolean = false;
  errCOBN: boolean = false;
  errCOBRegon: boolean = false;
  errCOLN: boolean = false;
  errCOLRegon: boolean = false;
  errCO2PFN: boolean = false;
  errCO2PSN: boolean = false;
  errCO2PP: boolean = false;
  errCO2PFamN: boolean = false;
  errCO2SFN: boolean = false;
  errCO2SSN: boolean = false;
  errCO2SP: boolean = false;
  errCO2SFamN: boolean = false;
  errCO2SRegon: boolean = false;
  errCO2CN: boolean = false;
  errCO2CRegon: boolean = false;
  errCO2BN: boolean = false;
  errCO2BRegon: boolean = false;
  errCO2LN: boolean = false;
  errCO2LRegon: boolean = false;

  public validPeselmo: boolean = true;
  public validPeselco: boolean = true;
  public validPeselco2: boolean = true;
  public validRegonmo: boolean = true;
  public validRegonco: boolean = true;
  public validRegonco2: boolean = true;

  public mainOwnerName: string = '';
  public mainOwnerSurname: string = '';
  public mainOwnerPesel: string = '';
  public mainOwnerFamName: string = '';
  public mainOwnerIsWoman: boolean = false;

  public coOwnerName: string = '';
  public coOwnerSurname: string = '';
  public coOwnerPesel: string;
  public coOwnerFamName: string = '';
  public coOwnerIsWoman: boolean = false;

  public coOwner2Name: string = '';
  public coOwner2Surname: string = '';
  public coOwner2Pesel: string = "";
  public coOwner2FamName: string = '';
  public coOwner2IsWoman: boolean = false;

  public mainOwnerSoleTraderName: string = "";
  public mainOwnerSoleTraderSurname: string = "";
  public mainOwnerSoleTraderPesel: string = "";
  public mainOwnerSoleTraderIsWoman = false;
  public mainOwnerSoleTraderFamName: string = "";
  public mainOwnerSoleTraderRegon: string = "";

  public coOwnerSoleTraderName: string = "";
  public coOwnerSoleTraderSurname: string = "";
  public coOwnerSoleTraderPesel: string = "";
  public coOwnerSoleTraderIsWoman = false;
  public coOwnerSoleTraderFamName: string = "";
  public coOwnerSoleTraderRegon: string = "";

  public coOwner2SoleTraderName: string = "";
  public coOwner2SoleTraderSurname: string = "";
  public coOwner2SoleTraderPesel: string = "";
  public coOwner2SoleTraderIsWoman = false;
  public coOwner2SoleTraderFamName: string = "";
  public coOwner2SoleTraderRegon: string = "";

  public mainOwnerCompName: string = "";
  public mainOwnerCompRegon: string = "";

  public mainOwnerBankName: string = "";
  public mainOwnerBankRegon: string = "";

  public mainOwnerLeaseName: string = "";
  public mainOwnerLeaseRegon: string = "";

  public coOwnerCompanyName: string = "";
  public coOwnerCompanyRegon: string = "";

  public coOwnerBankName: string = "";
  public coOwnerBankRegon: string = "";

  public coOwnerLeaseName: string = "";
  public coOwnerLeaseRegon: string = "";

  public coOwner2CompanyName: string = "";
  public coOwner2CompanyRegon: string = "";


  public coOwner2BankName: string = "";
  public coOwner2BankRegon: string = "";

  public coOwner2LeaseCompanyName: string = "";
  public coOwner2LeaseCompanyRegon: string = "";

  public coOwner: string = "";
  public coOwner2: string = "";

  public carOwner: boolean = false;
  public carCoOwner: boolean = false;;
  public carCoOwner2: boolean = false;;

  public carOwnerCount: number = -1;
  public disabledNext: boolean = true;

  showPeselErr: boolean = false;
  showRegErr: boolean = false;

  public isEmailPhone: boolean = false;
  public email: string = '';
  public isEmailValid: boolean = true;
  public phone: string = '';
  public isPhoneValid: boolean = true;

  public consentsArr = [];
  public selectedAllConsent: boolean;

  private prvKeyCode;
  public coowner1Radios: any;

  public emailChannelId = '';
  public phoneChannelId = '';
  public sessionOwnerData: any;

  public isMarketingConsentChecked: boolean = true;
  public consentsId = 'AZONLINE_OWNER';
  public questionCatelogueId = '';
  public applicationData: any;

  private currentPageId: number = 3;

  requestParams: any;

  ownerData = {
    contractId: '',
    propertyId: '',
    ownerDetails: []
  };
  /*code added for progress bar starts*/
  @ViewChild('progressbarActive') progressbarActive: ElementRef

  @ViewChild('progressbarActive1') progressbarActive1: ElementRef

  @ViewChild('progressbarLinear') progressbarLinear: ElementRef
  @ViewChild('mo') mo: ElementRef
  @ViewChild('co') co: ElementRef
  @ViewChild('co2') co2: ElementRef

  /*code added for progress bar ends*/

  ngOnInit() {
    this.carOwner = false;
    this.carCoOwner = false;
    this.carCoOwner2 = false;
    this.mainOwner = "";
    this.coOwner = "";
    this.coOwner2 = "";
    this.getStoredData();
    this.validateMandatoryFields();
    this._saveButtonShowHide.showQuoteId();
    this._saveButtonShowHide.showSaveButton();

    // if(this.consentsArr.length == 0){
    //   this.consentsArr = [      
    //     { id: 'input-1', name: ' Zapoznałam/-em się i akceptuję Regulamin serwisuOświadczam, iż zapoznałem/am się z Regulaminem świadczenia usług z wykorzystaniem serwisu internetowego www.turystyka.allianzdirect.pl, Pokażcałą treść', selected: false },
    //     { id: 'input-2',name: ' Potwierdzam, że wszelkie dane zawarte w umowie ubezpieczenia są zgodne z moją najlepszą wiedzą. Pokaż całą treść', selected: false },
    //     { id: 'input-3', name: 'Otwierdzam, że wszelkie dane zawarte w umowie ubezpieczenia są zgodne z moją najlepszą wiedzą. Pokaż całą treść', selected: false }
    //   ]
    //   }

    /*code to get current pageName and pageID and send it to adobe analytics*/

    var path = window.location.href;
    var pageData = path.split("#/");
    
    var currentPageName = pageData[1];
    


    if (currentPageName == "carownerdetails") {
      var pageName = "Car Owner";
      var pageID = "car/S3ownerDetail:Step3";

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
        this.saveCarOwnerData("Save");
        this.saveMainOwnerDataToSession();
      }
    });
  }



  saveUpdateFromPesel(owner: any, hasFamilyName: boolean, ownerType: any) {
    if (owner == 'mainOwner' && !hasFamilyName) {
      this.saveUpdateMainOwner(ownerType);
    } else if (owner == 'coOwner' && !hasFamilyName) {
      this.saveUpdateCoOwner(ownerType);
    } else if (owner == 'coOwner2' && !hasFamilyName) {
      this.saveUpdateCoOwner2(ownerType);
    }
  }
  saveUpdateMainOwner(mainOwnerType: any) {
    if( this.mainOwnerData.roleId !== undefined){
      if (this.mainOwnerData.roleId != '') {
        if (this.checkDiffMainOwner(this.mainOwner)) {
          this.updateMainOwner();
        } else {
          if (this.carCoOwner) {
            this.saveUpdateCoOwner('coOwner');
          } else {
            this.sendContactDetails();
          }
        }
      } else {
        this.saveMainOwner();
      }
    } else {
      this.saveMainOwner();
    }
    
  }
  saveUpdateCoOwner(coOwnerType: any) {
    if (this.coOwnerData.roleId !== undefined) {
      if (this.coOwnerData.roleId != '') {
        if (this.checkDiffCoOwner(this.coOwner)) {
          this.updateCoOwner();
        } else {
          if (this.carCoOwner2) {
            this.saveUpdateCoOwner2('coOwner2');
          } else {
            this.sendContactDetails();
          }
        }
      } else {
        this.saveCoOwner();
      }
    } else {
      this.saveCoOwner();
    }
  
  }
  saveUpdateCoOwner2(coOwner2Type: any) {
    if (this.coOwner2Data.roleId !== undefined) {
      if (this.coOwner2Data.roleId != '') {
        if (this.checkDiffCoOwner2(this.coOwner2)) {
          this.updateCoOwner2();
        } else {
          this.sendContactDetails();
        }
      } else {
        this.saveCoOwner2();
      }
    } else {
      this.saveCoOwner2();
    }

  }
  checkDiffCoOwner2(coOwner2Type) {
    if (this.sessionOwnerData != undefined) {
      if (coOwner2Type == "PrivatePerson") {
        if (this.sessionOwnerData.ownerDetails[2].firstName != this.coOwner2Name ||
          this.sessionOwnerData.ownerDetails[2].surName != this.coOwner2Surname ||
          this.sessionOwnerData.ownerDetails[2].peselId != this.coOwner2Pesel ||
          this.sessionOwnerData.ownerDetails[2].familyName != this.coOwner2FamName) {
          return true;
        } else {
          return false;
        }
      } else if (coOwner2Type == "SoleTrader") {
        if (this.sessionOwnerData.ownerDetails[2].firstName != this.coOwner2SoleTraderName ||
          this.sessionOwnerData.ownerDetails[2].surName != this.coOwner2SoleTraderSurname ||
          this.sessionOwnerData.ownerDetails[2].peselId != this.coOwner2SoleTraderPesel ||
          this.sessionOwnerData.ownerDetails[2].familyName != this.coOwner2SoleTraderFamName ||
          this.sessionOwnerData.ownerDetails[2].regOn != this.coOwner2SoleTraderRegon) {
          return true;
        } else {
          return false;
        }
      } else if (coOwner2Type == "Company") {
        if (this.sessionOwnerData.ownerDetails[2].companyName != this.coOwner2CompanyName ||
          this.sessionOwnerData.ownerDetails[2].companyRegOn != this.coOwner2CompanyRegon) {
          return true;
        } else {
          return false;
        }
      } else if (coOwner2Type == "Bank") {
        if (this.sessionOwnerData.ownerDetails[2].bankName != this.coOwner2BankName ||
          this.sessionOwnerData.ownerDetails[2].bankRegOn != this.coOwner2BankRegon) {
          return true;
        } else {
          return false;
        }
      } else if (coOwner2Type == "Leasing") {
        if (this.sessionOwnerData.ownerDetails[2].leaseName != this.coOwner2LeaseCompanyName ||
          this.sessionOwnerData.ownerDetails[2].leaseRegOn != this.coOwner2LeaseCompanyRegon) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  checkDiffCoOwner(coOwnerType): boolean {
    if (this.sessionOwnerData != undefined) {
      if (coOwnerType == "PrivatePerson") {
        if (this.sessionOwnerData.ownerDetails[1].firstName != this.coOwnerName ||
          this.sessionOwnerData.ownerDetails[1].surName != this.coOwnerSurname ||
          this.sessionOwnerData.ownerDetails[1].peselId != this.coOwnerPesel ||
          this.sessionOwnerData.ownerDetails[1].familyName != this.coOwnerFamName) {
          return true;
        } else {
          return false;
        }
      } else if (coOwnerType == "SoleTrader") {
        if (this.sessionOwnerData.ownerDetails[1].firstName != this.coOwnerSoleTraderName ||
          this.sessionOwnerData.ownerDetails[1].surName != this.coOwnerSoleTraderSurname ||
          this.sessionOwnerData.ownerDetails[1].peselId != this.coOwnerSoleTraderPesel ||
          this.sessionOwnerData.ownerDetails[1].familyName != this.coOwnerSoleTraderFamName ||
          this.sessionOwnerData.ownerDetails[1].regOn != this.coOwnerSoleTraderRegon) {
          return true;
        } else {
          return false;
        }
      } else if (coOwnerType == "Company") {
        if (this.sessionOwnerData.ownerDetails[1].companyName != this.coOwnerCompanyName ||
          this.sessionOwnerData.ownerDetails[1].companyRegOn != this.coOwnerCompanyRegon) {
          return true;
        } else {
          return false;
        }
      } else if (coOwnerType == "Bank") {
        if (this.sessionOwnerData.ownerDetails[1].bankName != this.coOwnerBankName ||
          this.sessionOwnerData.ownerDetails[1].bankRegOn != this.coOwnerBankRegon) {
          return true;
        } else {
          return false;
        }
      } else if (coOwnerType == "Leasing") {
        if (this.sessionOwnerData.ownerDetails[1].leaseName != this.coOwnerLeaseName ||
          this.sessionOwnerData.ownerDetails[1].leaseRegOn != this.coOwnerLeaseRegon) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  checkDiffMainOwner(mainOwnerType: any): boolean {
    if (this.sessionOwnerData != undefined) {
      if (mainOwnerType == "PrivatePerson") {
        if (this.sessionOwnerData.ownerDetails[0].firstName != this.mainOwnerName ||
          this.sessionOwnerData.ownerDetails[0].surName != this.mainOwnerSurname ||
          this.sessionOwnerData.ownerDetails[0].peselId != this.mainOwnerPesel ||
          this.sessionOwnerData.ownerDetails[0].familyName != this.mainOwnerFamName) {
          return true;
        } else {
          return false;
        }
      } else if (mainOwnerType == "SoleTrader") {
        if (this.sessionOwnerData.ownerDetails[0].firstName != this.mainOwnerSoleTraderName ||
          this.sessionOwnerData.ownerDetails[0].surName != this.mainOwnerSoleTraderSurname ||
          this.sessionOwnerData.ownerDetails[0].peselId != this.mainOwnerSoleTraderPesel ||
          this.sessionOwnerData.ownerDetails[0].familyName != this.mainOwnerSoleTraderFamName ||
          this.sessionOwnerData.ownerDetails[0].regOn != this.mainOwnerSoleTraderRegon) {
          return true;
        } else {
          return false;
        }
      } else if (mainOwnerType == "Company") {
        if (this.sessionOwnerData.ownerDetails[0].companyName != this.mainOwnerCompName ||
          this.sessionOwnerData.ownerDetails[0].companyRegOn != this.mainOwnerCompRegon) {
          return true;
        } else {
          return false;
        }
      } else if (mainOwnerType == "Bank") {
        if (this.sessionOwnerData.ownerDetails[0].bankName != this.mainOwnerBankName ||
          this.sessionOwnerData.ownerDetails[0].bankRegOn != this.mainOwnerBankRegon) {
          return true;
        } else {
          return false;
        }
      } else if (mainOwnerType == "Leasing") {
        if (this.sessionOwnerData.ownerDetails[0].leaseName != this.mainOwnerLeaseName ||
          this.sessionOwnerData.ownerDetails[0].leaseRegOn != this.mainOwnerLeaseRegon) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  updateMainOwner() {
    this.fillOwnerData('mainOwner');
    this.requestParams = {
      "firstName": this.ownerData.ownerDetails[0].firstName,
      "lastName": this.ownerData.ownerDetails[0].surName,
      "maidenName": this.ownerData.ownerDetails[0].familyName,
      "peselid": this.ownerData.ownerDetails[0].peselId,
      "typeOfOwnerShip": this.ownerData.ownerDetails[0].type == "PrivatePerson" ? "PP" : "",
      "roleName": "PO",
      "companyName": "",
      "regon": this.ownerData.ownerDetails[0].type == "SoleTrader" ? this.ownerData.ownerDetails[0].regOn : "",
      "mainOwner": true
    };
    if (this.mainOwner == "SoleTrader") {
      this.requestParams.typeOfOwnerShip = "ST"
    }

    if (this.mainOwner == "Company") {
      this.requestParams.companyName = this.ownerData.ownerDetails[0].companyName;
      this.requestParams.regon = this.ownerData.ownerDetails[0].companyRegOn;
    }
    if (this.mainOwner == "Bank") {
      this.requestParams.companyName = this.ownerData.ownerDetails[0].bankName;
      this.requestParams.regon = this.ownerData.ownerDetails[0].bankRegOn;
      this.requestParams.roleName = "BANK";
    }
    if (this.mainOwner == "Leasing") {
      this.requestParams.companyName = this.ownerData.ownerDetails[0].leaseName;
      this.requestParams.regon = this.ownerData.ownerDetails[0].leaseRegOn;
      this.requestParams.roleName = "LEASING";
    }
    this.cislService.updateOwnerDetails(this.requestParams, this.applicationData.contractId, this.ownerData.ownerDetails[0].partyId).subscribe(data => { this.serializeOwnerUpdateData(data, 'coOwner'); });
  }
  saveMainOwner() {
    this.fillOwnerData('mainOwner');
    this.requestParams = {
      "firstName": this.ownerData.ownerDetails[0].firstName,
      "lastName": this.ownerData.ownerDetails[0].surName,
      "maidenName": this.ownerData.ownerDetails[0].familyName,
      "peselid": this.ownerData.ownerDetails[0].peselId,
      "typeOfOwnerShip": this.ownerData.ownerDetails[0].type == "PrivatePerson" ? "PP" : "",
      "roleName": "PO",
      "companyName": "",
      "regon": this.ownerData.ownerDetails[0].type == "SoleTrader" ? this.ownerData.ownerDetails[0].regOn : "",
      "mainOwner": true
    }
    if (this.mainOwner == "SoleTrader") {
      this.requestParams.typeOfOwnerShip = "ST"
    }
    if (this.mainOwner == "Company") {
      this.requestParams.companyName = this.ownerData.ownerDetails[0].companyName;
      this.requestParams.regon = this.ownerData.ownerDetails[0].companyRegOn;
    }
    if (this.mainOwner == "Bank") {
      this.requestParams.companyName = this.ownerData.ownerDetails[0].bankName;
      this.requestParams.regon = this.ownerData.ownerDetails[0].bankRegOn;
      this.requestParams.roleName = "BANK";
    }
    if (this.mainOwner == "Leasing") {
      this.requestParams.companyName = this.ownerData.ownerDetails[0].leaseName;
      this.requestParams.regon = this.ownerData.ownerDetails[0].leaseRegOn;
      this.requestParams.roleName = "LEASING";
    }

    if (this.nextClicked) {
      this.cislService.saveOwnerDetails(this.requestParams, this.applicationData.contractId).subscribe(data => { this.serializeOwnerData(data, 'mainOwner'); });
    }

  }
  updateCoOwner() {
    this.fillOwnerData('coOwner');
    this.requestParams = {
      "firstName": this.ownerData.ownerDetails[1].firstName,
      "lastName": this.ownerData.ownerDetails[1].surName,
      "maidenName": this.ownerData.ownerDetails[1].familyName,
      "peselid": this.ownerData.ownerDetails[1].peselId,
      "typeOfOwnerShip": this.ownerData.ownerDetails[1].type == "PrivatePerson" ? "PP" : "",
      "roleName": "PO",
      "companyName": "",
      "regon": this.ownerData.ownerDetails[1].type == "SoleTrader" ? this.ownerData.ownerDetails[1].regOn : "",
      "mainOwner": false
    }
    if (this.coOwner == "SoleTrader") {
      this.requestParams.typeOfOwnerShip = "ST"
    }
    if (this.coOwner == "Company") {
      this.requestParams.companyName = this.ownerData.ownerDetails[1].companyName;
      this.requestParams.regon = this.ownerData.ownerDetails[1].companyRegOn;
    }
    if (this.coOwner == "Bank") {
      this.requestParams.companyName = this.ownerData.ownerDetails[1].bankName;
      this.requestParams.regon = this.ownerData.ownerDetails[1].bankRegOn;
      this.requestParams.roleName = "BANK";
    }
    if (this.coOwner == "Leasing") {
      this.requestParams.companyName = this.ownerData.ownerDetails[1].leaseName;
      this.requestParams.regon = this.ownerData.ownerDetails[1].leaseRegOn;
      this.requestParams.roleName = "LEASING";
    }
    this.cislService.updateOwnerDetails(this.requestParams, this.applicationData.contractId, this.ownerData.ownerDetails[1].partyId).subscribe(data => { this.serializeOwnerUpdateData(data, 'coOwner2'); });
  }
  saveCoOwner() {
    this.fillOwnerData('coOwner');
    this.requestParams = {
      "firstName": this.ownerData.ownerDetails[1].firstName,
      "lastName": this.ownerData.ownerDetails[1].surName,
      "maidenName": this.ownerData.ownerDetails[1].familyName,
      "peselid": this.ownerData.ownerDetails[1].peselId,
      "typeOfOwnerShip": this.ownerData.ownerDetails[1].type == "PrivatePerson" ? "PP" : "",
      "roleName": "PO",
      "companyName": "",
      "regon": this.ownerData.ownerDetails[1].type == "SoleTrader" ? this.ownerData.ownerDetails[1].regOn : "",
      "mainOwner": false
    }
    if (this.coOwner == "SoleTrader") {
      this.requestParams.typeOfOwnerShip = "ST"
    }
    if (this.coOwner == "Company") {
      this.requestParams.companyName = this.ownerData.ownerDetails[1].companyName;
      this.requestParams.regon = this.ownerData.ownerDetails[1].companyRegOn;
    }
    if (this.coOwner == "Bank") {
      this.requestParams.companyName = this.ownerData.ownerDetails[1].bankName;
      this.requestParams.regon = this.ownerData.ownerDetails[1].bankRegOn;
      this.requestParams.roleName = "BANK";
    }
    if (this.coOwner == "Leasing") {
      this.requestParams.companyName = this.ownerData.ownerDetails[1].leaseName;
      this.requestParams.regon = this.ownerData.ownerDetails[1].leaseRegOn;
      this.requestParams.roleName = "LEASING";
    }

    if (this.nextClicked) {
      this.cislService.saveOwnerDetails(this.requestParams, this.applicationData.contractId).subscribe(data => { this.serializeOwnerData(data, 'coOwner'); });
    }
  }
  updateCoOwner2() {
    this.fillOwnerData('coOwner2');
    this.requestParams = {
      "firstName": this.ownerData.ownerDetails[2].firstName,
      "lastName": this.ownerData.ownerDetails[2].surName,
      "maidenName": this.ownerData.ownerDetails[2].familyName,
      "peselid": this.ownerData.ownerDetails[2].peselId,
      "typeOfOwnerShip": this.ownerData.ownerDetails[2].type == "PrivatePerson" ? "PP" : "",
      "roleName": "PO",
      "companyName": "",
      "regon": this.ownerData.ownerDetails[2].type == "SoleTrader" ? this.ownerData.ownerDetails[2].regOn : "",
      "mainOwner": false
    }
    if (this.coOwner2 == "SoleTrader") {
      this.requestParams.typeOfOwnerShip = "ST"
    }
    if (this.coOwner2 == "Company") {
      this.requestParams.companyName = this.ownerData.ownerDetails[2].companyName;
      this.requestParams.regon = this.ownerData.ownerDetails[2].companyRegOn;
    }
    if (this.coOwner2 == "Bank") {
      this.requestParams.companyName = this.ownerData.ownerDetails[2].bankName;
      this.requestParams.regon = this.ownerData.ownerDetails[2].bankRegOn;
      this.requestParams.roleName = "BANK";
    }
    if (this.coOwner2 == "Leasing") {
      this.requestParams.companyName = this.ownerData.ownerDetails[2].leaseName;
      this.requestParams.regon = this.ownerData.ownerDetails[2].leaseRegOn;
      this.requestParams.roleName = "LEASING";
    }
    this.cislService.updateOwnerDetails(this.requestParams, this.applicationData.contractId, this.ownerData.ownerDetails[2].partyId).subscribe(data => { this.serializeOwnerUpdateData(data, ''); });
  }
  saveCoOwner2() {
    this.fillOwnerData('coOwner2');
    this.requestParams = {
      "firstName": this.ownerData.ownerDetails[2].firstName,
      "lastName": this.ownerData.ownerDetails[2].surName,
      "maidenName": this.ownerData.ownerDetails[2].familyName,
      "peselid": this.ownerData.ownerDetails[2].peselId,
      "typeOfOwnerShip": this.ownerData.ownerDetails[2].type == "PrivatePerson" ? "PP" : "",
      "roleName": "PO",
      "companyName": "",
      "regon": this.ownerData.ownerDetails[2].type == "SoleTrader" ? this.ownerData.ownerDetails[2].regOn : "",
      "mainOwner": false
    }
    if (this.coOwner2 == "SoleTrader") {
      this.requestParams.typeOfOwnerShip = "ST"
    }
    if (this.coOwner2 == "Company") {
      this.requestParams.companyName = this.ownerData.ownerDetails[2].companyName;
      this.requestParams.regon = this.ownerData.ownerDetails[2].companyRegOn;
    }
    if (this.coOwner2 == "Bank") {
      this.requestParams.companyName = this.ownerData.ownerDetails[2].bankName;
      this.requestParams.regon = this.ownerData.ownerDetails[2].bankRegOn;
      this.requestParams.roleName = "BANK";
    }
    if (this.coOwner2 == "Leasing") {
      this.requestParams.companyName = this.ownerData.ownerDetails[2].leaseName;
      this.requestParams.regon = this.ownerData.ownerDetails[2].leaseRegOn;
      this.requestParams.roleName = "LEASING";
    }

    if (this.nextClicked) {
      this.cislService.saveOwnerDetails(this.requestParams, this.applicationData.contractId).subscribe(data => { this.serializeOwnerData(data, 'coOwner2'); });
    }
  }

  // For Text Field Placeholder text animation 


  validateSpace(event) {
    let value = event.target.value;
    event.target.value = value.replace(/  +/g, ' ');
  }

  titleCaseName(event) {
    this.mainOwnerName = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseSurName(event) {
    this.mainOwnerSurname = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseFamName(event) {
    this.mainOwnerFamName = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseSoleTraderName(event) {
    this.mainOwnerSoleTraderName = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseSoleTraderSurName(event) {
    this.mainOwnerSoleTraderSurname = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseSoleTraderFamName(event) {
    this.mainOwnerSoleTraderFamName = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseCoOwnerName(event) {
    this.coOwnerName = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseCoOwnerSurname(event) {
    this.coOwnerSurname = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseCoOwnerFamName(event) {
    this.coOwnerFamName = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseCoOwnerSoleTraderName(event) {
    this.coOwnerSoleTraderName = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseCoOwnerSoleTraderSurname(event) {
    this.coOwnerSoleTraderSurname = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseCoOwnerSoleTraderFamName(event) {
    this.coOwnerSoleTraderFamName = this.titleConvert.titleCase(event.target.value);
  }
  titleCasecoOwner2Name(event) {
    this.coOwner2Name = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseCoOwner2Surname(event) {
    this.coOwner2Surname = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseCoOwner2FamName(event) {
    this.coOwner2FamName = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseCoOwner2SoleTraderName(event) {
    this.coOwner2SoleTraderName = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseCoOwner2SoleTraderSurName(event) {
    this.coOwner2SoleTraderSurname = this.titleConvert.titleCase(event.target.value);
  }
  titleCaseCoOwner2SoleTraderFamName(event) {
    this.coOwner2SoleTraderFamName = this.titleConvert.titleCase(event.target.value);
  }

  addClass(event): void {
    event.target.classList.add('is-filled');
  }
  removeClass(event): void {
    let value = event.target.value.trim();
    event.target.value = value;
    if (event.target.value) {
      return;
    }
    if (event.target.classList.contains('ng-invalid') || event.target.value) {
      event.target.classList.remove('is-filled');
    }
  }

  checkRegon(event) {
    let val: string = event.target.value.replace(/[^0-9]+/, '');
    event.target.value = val;
    this.checkDuplicateRegOn();
  }
  checkPasel(event, booleVal, owner: any) {
    let val: string = event.target.value.replace(/[^0-9]+/, '');
    event.target.value = val;
    let str = val.slice(9, 10);
    let length = val.length;
    if (length >= 10) {
      if (str == "0" || str == "2" || str == "4" || str == "6" || str == "8") {
        this[booleVal] = true;
        return;
      } else {
        this[booleVal] = false;
      }
    } else {
      this[booleVal] = false;
    }
    if (owner == 'mainOwner') {
      this.mainOwnerData.peselId = this.mainOwnerPesel;
    } else if (owner == 'coOwner') {
      this.coOwnerData.peselId = this.coOwnerPesel;
    } else {
      this.coOwner2Data.peselId = this.coOwner2Pesel;
    }
    this.checkDuplicatePesel();
  }

  //For Special character validation 
  omit_special_char(event) {
    let k;
    let val = false;
    k = event.charCode;
    if ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 0 || k == 45 || k >= 128) {
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

  acceptOnlyNumbers(event) {
    let k = event.charCode;
    let val = false;
    if ((k >= 48 && k <= 57 || k == 32 || k == 8 || k == 0) || (k == 118 && event.keyCode == 0)) {
      return;
    } else {
      return val;
    }
  }

  addCarCoOwner(event): void {
    event.target.blur();
    this.carOwnerCount++;
    if (this.carCoOwner == false) {
      this.carCoOwner = true;
      this.carCoOwner2 = false;
    } else {
      this.carOwner = true;
      this.carCoOwner = true;
      this.carCoOwner2 = true;
    }
    this.disabledNext = true;
  }

  /* Owner Contact details */

  sendContactDetails() {
    if (this.sessionOwnerData == undefined) {
      if ((this.email !== '' && this.phone !== '') && (this.isEmailValid && this.isPhoneValid)) {
        this.postContactDetails();
      } else {
        this.saveMainOwnerData();
      }
    } else {
      if ((this.applicationData.owner.email == '' && this.applicationData.owner.phone == '') && (this.email !== '' && this.phone !== '')
          || (this.applicationData.owner.phoneChannelId == undefined && this.applicationData.owner.emailChannelId == undefined)) {
        this.postContactDetails();
      } else if (this.applicationData.owner.email !== this.email && this.applicationData.owner.phone !== this.phone) {
        let params = [{
          "partySelf": this.sessionOwnerData.ownerDetails[0].partyId,
          "phoneNumberSelf": this.applicationData.owner.phoneChannelId,
          "phoneNumber": this.phone,
          "emailSelf": this.applicationData.owner.emailChannelId,
          "email": this.email
        }];
        this.cislService.updateContact(this.applicationData.contractId, params).subscribe(data => { this.contactDataUpdateSuccess(data) });

      } else if (this.applicationData.owner.phone !== this.phone) {
        let params = [{
          "partySelf": this.sessionOwnerData.ownerDetails[0].partyId,
          "phoneNumberSelf": this.applicationData.owner.phoneChannelId,
          "phoneNumber": this.phone
        }];
        this.cislService.updateContact(this.applicationData.contractId, params).subscribe(data => { this.contactDataUpdateSuccess(data) });
      } else if (this.applicationData.owner.email !== this.email) {
        let params = [{
          "partySelf": this.sessionOwnerData.ownerDetails[0].partyId,
          "emailSelf": this.applicationData.owner.emailChannelId,
          "email": this.email
        }];
        this.cislService.updateContact(this.applicationData.contractId, params).subscribe(data => { this.contactDataUpdateSuccess(data) });
      } else {
        this.saveMainOwnerData();
      }

    }
  }

  postContactDetails() {
    let param = [{
      "partySelf": this.ownerData.ownerDetails[0].partyId,
      "phoneNumber": this.phone,
      "email": this.email
    }];
    
    this.cislService.postContactDetails(this.applicationData.contractId, param).subscribe(data => { this.contactDataPostSuccess(data) });
  }

  contactDataPostSuccess(data) {
    this.ownerData.ownerDetails[0].email = this.email;
    this.ownerData.ownerDetails[0].phone = this.phone;
    this.ownerData.ownerDetails[0].emailChannelId = data[0].emailSelf;
    this.ownerData.ownerDetails[0].phoneChannelId = data[0].phoneNumberSelf;

    this.saveMainOwnerData();
  }

  contactDataUpdateSuccess(data) {
    this.ownerData.ownerDetails[0].email = this.email;
    this.ownerData.ownerDetails[0].phone = this.phone;
    this.saveMainOwnerData();
  }

  saveMainOwnerData() {
    // this.saveMainOwnerDataToSession();
    this.saveQuoteService.autoSavePageData();
    this.router.navigateByUrl('/driverdetails');
  }

  saveMainOwnerDataToSession() {
    let ownerContacts = {
      "email": this.email,
      "phone": this.phone,
      "emailChannelId": this.ownerData.ownerDetails[0] ? this.ownerData.ownerDetails[0].emailChannelId : '',
      "phoneChannelId": this.ownerData.ownerDetails[0] ? this.ownerData.ownerDetails[0].phoneChannelId : ''
    }

    this.applicationData.owner = ownerContacts;
    this.applicationData.currentPageId = this.saveQuoteService.currentPageId;
    sessionStorage.setItem("Application", JSON.stringify(this.applicationData));
    sessionStorage.setItem("ownerData", JSON.stringify(this.ownerData));
  }

  serializeOwnerData(data: any, ownerType) {
    if (ownerType == 'mainOwner') {
      this.ownerData.ownerDetails[0].roleId = data.roleId;
      this.ownerData.ownerDetails[0].partyId = data.partyId;
      if (this.carCoOwner) {
        this.saveUpdateCoOwner('coOwner');
      } else {
        this.sendContactDetails();
      }
    } else if (ownerType == 'coOwner') {
      this.ownerData.ownerDetails[1].roleId = data.roleId;
      this.ownerData.ownerDetails[1].partyId = data.partyId;
      if (this.carCoOwner2) {
        this.saveUpdateCoOwner('coOwner2');
      } else {
        this.sendContactDetails();
      }
    } else {
      this.ownerData.ownerDetails[2].roleId = data.roleId;
      this.ownerData.ownerDetails[2].partyId = data.partyId;
      this.sendContactDetails();
    }
  }
  serializeOwnerUpdateData(data: any, ownerType: any) {
    if (ownerType == 'coOwner') {
      if (this.carCoOwner) {
        this.saveUpdateCoOwner('coOwner');
      } else {
        this.sendContactDetails();
      }
    }
    if (ownerType == 'coOwner2') {
      if (this.carCoOwner2) {
        this.saveUpdateCoOwner2('coOwner2');
      } else {
        this.sendContactDetails();
      }
    } else {
      this.sendContactDetails();
    }
  }
  carCoOwner2check(event): void {
    this.carCoOwner2 = true;
  }
  removeCoOwner(event): void {
    this.nextClicked = false;
    event.target.blur();
    this.carOwnerCount--;
    if (this.carCoOwner2 == true) {
      if (this.ownerData.ownerDetails.length > 2) {
        if (this.ownerData.ownerDetails[2].roleId != '') {
          this.deleteCoOwner2(this.applicationData.contractId, this.ownerData.ownerDetails[2].partyId);
        }
        this.ownerData.ownerDetails.pop();
      }
      this.carCoOwner2 = false;
      this.resetcoOwner2Fields();
      this.coOwner2 = '';
    } else if (this.carCoOwner == true) {
      if (this.ownerData.ownerDetails.length > 1) {
        if (this.ownerData.ownerDetails[1].roleId != '') {
          this.deleteCoOwner(this.applicationData.contractId, this.ownerData.ownerDetails[1].partyId);
        }
         this.ownerData.ownerDetails.pop();
      }
      this.carCoOwner = false;
      this.resetcoOwnerFields();
      this.coOwner = '';
    }
    this.validateMandatoryFields();
  }
  deleteCoOwner(contractId: any, partyId: any) {
    this.cislService.deleteOwnerDetails(contractId, partyId).subscribe(data => { this.serializeOwnerDeleteData(); });
  }
  deleteCoOwner2(contractId: any, partyId: any) {
    this.cislService.deleteOwnerDetails(contractId, partyId).subscribe(data => { this.serializeOwnerDeleteData(); });
  }
  serializeOwnerDeleteData() {

  }
  checkDuplicatePesel(): boolean {
    var pesel1 = this.mainOwnerPesel == '' ? this.mainOwnerSoleTraderPesel : this.mainOwnerPesel;
    var pesel2 = this.coOwnerPesel == '' ? this.coOwnerSoleTraderPesel : this.coOwnerPesel;
    var pesel3 = this.coOwner2Pesel == '' ? this.coOwner2SoleTraderPesel : this.coOwner2Pesel;
    if (pesel1 != '' && pesel2 != '' && pesel3 == '') {
      if (pesel1 == pesel2) {
        this.showPeselErr = true;
        return true;
      } else {
        this.showPeselErr = false;
        return false;
      }
    } else if (pesel1 != '' && pesel3 != '' && pesel2 == '') {
      if (pesel1 == pesel3) {
        this.showPeselErr = true;
        return true;
      } else {
        this.showPeselErr = false;
        return false;
      }
    } else if (pesel3 != '' && pesel2 != '' && pesel1 == '') {
      if (pesel2 == pesel3) {
        this.showPeselErr = true;
        return true;
      } else {
        this.showPeselErr = false;
        return false;
      }
    } else if (pesel1 != '' && pesel2 != '' && pesel3 != '') {
      if (pesel1 == pesel2 || pesel1 == pesel3 || pesel2 == pesel3) {
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
  checkDuplicateRegOn() {
    var reg1 = '';
    var reg2 = '';
    var reg3 = '';
    if (this.mainOwner != "PrivatePerson") {
      if (this.mainOwner == "SoleTrader") {
        reg1 = this.mainOwnerSoleTraderRegon;
      } else if (this.mainOwner == "Company") {
        reg1 = this.mainOwnerCompRegon;
      } else if (this.mainOwner == "Bank") {
        reg1 = this.mainOwnerBankRegon;
      } else {
        reg1 = this.mainOwnerLeaseRegon;
      }
    }
    if (this.coOwner != "PrivatePerson") {
      if (this.coOwner == "SoleTrader") {
        reg2 = this.coOwnerSoleTraderRegon;
      } else if (this.coOwner == "Company") {
        reg2 = this.coOwnerCompanyRegon;
      } else if (this.coOwner == "Bank") {
        reg2 = this.coOwnerBankRegon;
      } else {
        reg2 = this.coOwnerLeaseRegon;
      }
    }
    if (this.coOwner2 != "PrivatePerson") {
      if (this.coOwner2 == "SoleTrader") {
        reg3 = this.coOwner2SoleTraderRegon;
      } else if (this.coOwner2 == "Company") {
        reg3 = this.coOwner2CompanyRegon;
      } else if (this.coOwner2 == "Bank") {
        reg3 = this.coOwner2BankRegon;
      } else {
        reg3 = this.coOwner2LeaseCompanyRegon;
      }
    }
    if (reg1 != '' && reg2 != '' && reg3 == '') {
      if (reg1 == reg2) {
        this.showRegErr = true;
        return true;
      } else {
        this.showRegErr = false;
        return false;
      }
    } else if (reg1 != '' && reg3 != '' && reg2 == '') {
      if (reg1 == reg3) {
        this.showRegErr = true;
        return true;
      } else {
        this.showRegErr = false;
        return false;
      }
    } else if (reg3 != '' && reg2 != '' && reg1 == '') {
      if (reg2 == reg3) {
        this.showRegErr = true;
        return true;
      } else {
        this.showRegErr = false;
        return false;
      }
    } else if (reg1 != '' && reg2 != '' && reg3 != '') {
      if (reg1 == reg2 || reg1 == reg3 || reg2 == reg3) {
        this.showRegErr = true;
        return true;
      } else {
        this.showRegErr = false;
        return false;
      }
    } else {
      this.showRegErr = false;
      return false;
    }
  }
  validateMandatoryFields() {
    let isMainOwnerValid: boolean = false;
    let isCoOwnerValid: boolean = false;
    switch (this.mainOwner) {
      case "PrivatePerson":
        this.validatePrivatePerson("mainOwner");
        break;
      case "SoleTrader":
        this.validateSoleTrader("mainOwner");
        break;
      case "Company":
        this.validateOwner(this.mainOwnerCompName, this.mainOwnerCompRegon);
        break;
      case "Bank":
        this.validateOwner(this.mainOwnerBankName, this.mainOwnerBankRegon)
        break;
      case "Leasing":
        this.validateOwner(this.mainOwnerLeaseName, this.mainOwnerLeaseRegon)
        break;
      default:
    }

    isMainOwnerValid = !this.disabledNext;
    if (isMainOwnerValid) {
      switch (this.coOwner) {
        case "PrivatePerson":
          this.validatePrivatePerson("coOwner");
          break;
        case "SoleTrader":
          this.validateSoleTrader("coOwner");
          break;
        case "Company":
          this.validateOwner(this.coOwnerCompanyName, this.coOwnerCompanyRegon);
          break;
        case "Bank":
          this.validateOwner(this.coOwnerBankName, this.coOwnerBankRegon)
          break;
        case "Leasing":
          this.validateOwner(this.coOwnerLeaseName, this.coOwnerLeaseRegon)
          break;
        default:
      }
    } else {
      return;
    }

    isCoOwnerValid = !this.disabledNext;
    if (isMainOwnerValid && isCoOwnerValid) {
      switch (this.coOwner2) {
        case "PrivatePerson":
          this.validatePrivatePerson("coOwner2");
          break;
        case "SoleTrader":
          this.validateSoleTrader("coOwner2");
          break;
        case "Company":
          this.validateOwner(this.coOwner2CompanyName, this.coOwner2CompanyRegon);
          break;
        case "Bank":
          this.validateOwner(this.coOwner2BankName, this.coOwner2BankRegon)
          break;
        case "Leasing":
          this.validateOwner(this.coOwner2LeaseCompanyName, this.coOwner2LeaseCompanyRegon)
          break;
        default:
      }
    } else {
      return;
    }
    // this.checkDuplicatePesel();
  }
  validatePrivatePerson(owner: any) {

    let familyName;
    if (owner == "mainOwner") {
      let firstName = this.validateInputFiled(this.mainOwnerName);
      let surname = this.validateInputFiled(this.mainOwnerSurname);
      if (firstName && surname) {
        if (this.mainOwnerIsWoman) {
          familyName = this.validateInputFiled(this.mainOwnerFamName);
          if (familyName) {
            this.disabledNext = false;
          } else {
            this.disabledNext = true;
          }
        } else {
          this.disabledNext = false;
        }
      } else {
        this.disabledNext = true;
      }
    } else if (owner == "coOwner") {
      let firstName = this.validateInputFiled(this.coOwnerName);
      let surname = this.validateInputFiled(this.coOwnerSurname);
      if (firstName && surname) {
        if (this.coOwnerIsWoman) {
          familyName = this.validateInputFiled(this.coOwnerFamName);
          if (familyName) {
            this.disabledNext = false;
          } else {
            this.disabledNext = true;
          }
        } else {
          this.disabledNext = false;
        }
      } else {
        this.disabledNext = true;
      }
    } else {
      let firstName = this.validateInputFiled(this.coOwner2Name);
      let surname = this.validateInputFiled(this.coOwner2Surname);
      if (firstName && surname) {
        if (this.coOwner2IsWoman) {
          familyName = this.validateInputFiled(this.coOwner2FamName);
          if (familyName) {
            this.disabledNext = false;
          } else {
            this.disabledNext = true;
          }
        } else {
          this.disabledNext = false;
        }
      } else {
        this.disabledNext = true;
      }
    }
  }

  validateSoleTrader(owner: any) {

    let familyName;
    if (owner == "mainOwner") {
      let firstName = this.validateInputFiled(this.mainOwnerSoleTraderName);
      let surname = this.validateInputFiled(this.mainOwnerSoleTraderSurname);
      if (firstName && surname) {
        if (this.mainOwnerSoleTraderIsWoman) {
          familyName = this.validateInputFiled(this.mainOwnerSoleTraderFamName);
          if (familyName) {
            this.disabledNext = false;
          } else {
            this.disabledNext = true;
          }
        } else {
          this.disabledNext = false;
        }
      } else {
        this.disabledNext = true;
      }
    } else if (owner == "coOwner") {
      let firstName = this.validateInputFiled(this.coOwnerSoleTraderName);
      let surname = this.validateInputFiled(this.coOwnerSoleTraderSurname);
      if (firstName && surname) {
        if (this.coOwnerSoleTraderIsWoman) {
          familyName = this.validateInputFiled(this.coOwnerSoleTraderFamName);
          if (familyName) {
            this.disabledNext = false;
          } else {
            this.disabledNext = true;
          }
        } else {
          this.disabledNext = false;
        }
      } else {
        this.disabledNext = true;
      }
    } else {
      let firstName = this.validateInputFiled(this.coOwner2SoleTraderName);
      let surname = this.validateInputFiled(this.coOwner2SoleTraderSurname);
      if (firstName && surname) {
        if (this.coOwner2SoleTraderIsWoman) {
          familyName = this.validateInputFiled(this.coOwner2SoleTraderFamName);
          if (familyName) {
            this.disabledNext = false;
          } else {
            this.disabledNext = true;
          }
        } else {
          this.disabledNext = false;
        }
      } else {
        this.disabledNext = true;
      }
    }
  }

  validateOwner(name, regonVal) {
    let firstName = this.validateInputFiled(name);
    if (firstName) {
      this.disabledNext = false;
    } else {
      this.disabledNext = true;
    }
  }

  validateInputFiled(field) {
    if (field.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  isValidRegon(regon) {
    let isAllZero: boolean = true;
    var REGON = [];
    for (var i = 0; i < regon.length; i++) {
      REGON[i] = parseInt(regon.substring(i, i + 1));
      if (isAllZero && REGON[i] !== 0) {
        isAllZero = false;
      }
    }
    if (isAllZero) {
      return false;
    } else if (this.checkSumRegon(REGON)) {
      return true;
    }
    else {
      return false;
    }
  }
  validateRegon(onblur, ownerType, regon) {
    if (onblur) {
      if (regon.length == 9 || regon.length == 14) {
        this['validRegon' + ownerType] = this.isValidRegon(regon);
        if (!this.isValidRegon(regon)) {
          this.scrollToView(ownerType);
        }
      } else if (regon.length != '' && !(regon.length == 9 || regon.length == 14)) {
        this['validRegon' + ownerType] = false;
        this.scrollToView(ownerType);
      }
    } else {
      this['validRegon' + ownerType] = true;
      if (ownerType == 'mo') {
        this.errMOSRegon = false;
        this.errMOBRegon = false;
        this.errMOCRegon = false;
        this.errMOLRegon = false;
      }
      if (ownerType == 'co') {
        this.errCOSRegon = false;
        this.errCOBRegon = false;
        this.errCOCRegon = false;
        this.errCOLRegon = false;
      }
      if (ownerType == 'co2') {
        this.errCO2SRegon = false;
        this.errCO2BRegon = false;
        this.errCO2CRegon = false;
        this.errCO2LRegon = false;
      }
      if (regon.length == 9 || regon.length == 14) {
        this['validRegon' + ownerType] = this.isValidRegon(regon);
      }
    }
  }
  checkSumRegon(REGON: any): any {
    if (REGON.length == 9) {
      return this.checkSumRegon9(REGON);
    }
    else {
      return (this.checkSumRegon9(REGON) && this.checkSumRegon14(REGON));
    }
  }
  checkSumRegon9(REGON: any): any {
    var sum = 8 * REGON[0] +
      9 * REGON[1] +
      2 * REGON[2] +
      3 * REGON[3] +
      4 * REGON[4] +
      5 * REGON[5] +
      6 * REGON[6] +
      7 * REGON[7];
    sum %= 11;
    if (sum == 10) {
      sum = 0;
    }
    if (sum == REGON[8]) {
      return true;
    }
    else {
      return false;
    }
  }
  checkSumRegon14(REGON: any): any {
    var sum = 2 * REGON[0] +
      4 * REGON[1] +
      8 * REGON[2] +
      5 * REGON[3] +
      0 * REGON[4] +
      9 * REGON[5] +
      7 * REGON[6] +
      3 * REGON[7] +
      6 * REGON[8] +
      1 * REGON[9] +
      2 * REGON[10] +
      4 * REGON[11] +
      8 * REGON[12];
    sum %= 11;
    if (sum == 10) {
      sum = 0;
    }
    if (sum == REGON[13]) {
      return true;
    }
    else {
      return false;
    }
  }
  validatePesel(pesel, ownerType): boolean {
    var PESEL = [];
    for (var i = 0; i < pesel.length; i++) {
      PESEL[i] = parseInt(pesel.substring(i, i + 1));
    }
    if (this.checkSum(PESEL) && this.checkMonth(PESEL) && this.checkDay(PESEL)) {
      return true;
    }
    else {
      return false;
    }
  }
  validatePeselOnBlur(event) {
    var pesel = event.target.value;
    var ownerType = event.target.id.split('_')[3];
    if (pesel.length == 11) {
      this['validPesel' + ownerType] = this.validatePesel(pesel, ownerType);
      if (!this.validatePesel(pesel, ownerType)) {
        this.scrollToView(ownerType);
      }
    } else if (pesel != '' && pesel.length < 11) {
      this['validPesel' + ownerType] = false;
      this.scrollToView(ownerType);
    }
  }
  validatePeselOnKeyup(event) {
    var pesel = event.target.value;
    var ownerType = event.target.id.split('_')[3];
    this['validPesel' + ownerType] = true;
    if (ownerType == 'mo') {
      this.errMOPP = false;
      this.errMOSP = false;
    }
    if (ownerType == 'co') {
      this.errCOPP = false;
      this.errCOSP = false;
    }
    if (ownerType == 'co2') {
      this.errCO2PP = false;
      this.errCO2SP = false;
    }
    if (pesel.length == 11) {
      this['validPesel' + ownerType] = this.validatePesel(pesel, ownerType);
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
    var year = this.getBirthYear(PESEL);
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
  getBirthYear(PESEL: any): any {
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

  resetMainOwnerFields() {
    // this.ownerData.ownerDetails.push(this.mainOwnerData);
    this.mainOwnerName = this.mainOwnerData.firstName = '';
    this.mainOwnerSurname = this.mainOwnerData.surName = '';
    this.mainOwnerPesel = this.mainOwnerData.peselId = '';
    this.mainOwnerFamName = this.mainOwnerData.familyName = '';
    this.mainOwnerIsWoman = false;
    this.mainOwnerCompName = this.mainOwnerData.companyName = "";
    this.mainOwnerCompRegon = this.mainOwnerData.companyRegOn = "";
    this.mainOwnerBankName = this.mainOwnerData.bankName = "";
    this.mainOwnerBankRegon = this.mainOwnerData.bankRegOn = "";
    this.mainOwnerLeaseName = this.mainOwnerData.leaseName = "";
    this.mainOwnerLeaseRegon = this.mainOwnerData.leaseRegOn = "";
    this.mainOwnerSoleTraderName = "";
    this.mainOwnerSoleTraderSurname = "";
    this.mainOwnerSoleTraderPesel = "";
    this.mainOwnerSoleTraderIsWoman = false;
    this.mainOwnerSoleTraderFamName = "";
    this.mainOwnerSoleTraderRegon = this.mainOwnerData.regOn = "";
    this.disabledNext = true;
    if (this.carOwnerCount == -1) {
      this.carOwnerCount = 0;
    }
    this.resetErrors('mo');
    this.validPeselmo = true;
    this.validRegonmo = true;
  }
  resetcoOwnerFields() {
    //this.ownerData.ownerDetails.push(this.coOwnerData);
    this.coOwnerName = this.coOwnerData.firstName = '';
    this.coOwnerSurname = this.coOwnerData.surName = '';
    this.coOwnerPesel = this.coOwnerData.peselId = '';
    this.coOwnerFamName = this.coOwnerData.familyName = '';
    this.coOwnerIsWoman = false;
    this.coOwnerCompanyName = this.coOwnerData.companyName = "";
    this.coOwnerCompanyRegon = this.coOwnerData.companyRegOn = "";
    this.coOwnerBankName = this.coOwnerData.bankName = "";
    this.coOwnerBankRegon = this.coOwnerData.bankRegOn = "";
    this.coOwnerLeaseName = this.coOwnerData.leaseName = "";
    this.coOwnerLeaseRegon = this.coOwnerData.leaseRegOn = "";
    this.coOwnerSoleTraderName = "";
    this.coOwnerSoleTraderSurname = "";
    this.coOwnerSoleTraderPesel = "";
    this.coOwnerSoleTraderIsWoman = false;
    this.coOwnerSoleTraderFamName = "";
    this.coOwnerSoleTraderRegon = this.coOwnerData.regOn = "";
    this.coOwnerData.roleId = '';
    this.coOwnerData.partyId = '';
    delete sessionStorage.carCoOwner;
    this.resetErrors('co');
    this.validPeselco = true;
    this.validRegonco = true;
  }
  resetcoOwner2Fields() {
    // this.ownerData.ownerDetails.push(this.coOwner2Data); 
    this.coOwner2Name = this.coOwner2Data.firstName = '';
    this.coOwner2Surname = this.coOwner2Data.surName = '';
    this.coOwner2Pesel = this.coOwner2Data.peselId = '';
    this.coOwner2FamName = this.coOwner2Data.familyName = '';
    this.coOwner2IsWoman = false;
    this.coOwner2CompanyName = this.coOwner2Data.companyName = "";
    this.coOwner2CompanyRegon = this.coOwner2Data.companyRegOn = "";
    this.coOwner2BankName = this.coOwner2Data.bankName = "";
    this.coOwner2BankRegon = this.coOwner2Data.bankRegOn = "";
    this.coOwner2LeaseCompanyName = this.coOwner2Data.leaseName = "";
    this.coOwner2LeaseCompanyRegon = this.coOwner2Data.leaseRegOn = "";
    this.coOwner2SoleTraderName = "";
    this.coOwner2SoleTraderSurname = "";
    this.coOwner2SoleTraderPesel = "";
    this.coOwner2SoleTraderIsWoman = false;
    this.coOwner2SoleTraderFamName = "";
    this.coOwner2SoleTraderRegon = this.coOwner2Data.regOn = "";
    this.coOwner2Data.roleId = '';
    this.coOwner2Data.partyId = '';
    delete sessionStorage.carCoOwner2;
    this.resetErrors('co2');
    this.validPeselco2 = true;
    this.validRegonco2 = true;
  }
  saveCarOwnerData(buttonClicked: any) {
    let mainOwnerData;
    let carCoOwner2Data;
    let carCoOwnerData;
    this.carOwner = true;
    if (this.carOwner) {
      this.fillOwnerData('mainOwner');
    }
    if (this.carCoOwner) {
      this.fillOwnerData('coOwner');
    }
    if (this.carCoOwner2) {
      this.fillOwnerData('coOwner2');
    }

    /* code changes for save owner details */
    this.ownerData.ownerDetails = [];
    this.ownerData.ownerDetails.push(this.mainOwnerData);
    if (this.carOwnerCount == 1) {
      this.ownerData.ownerDetails.push(this.coOwnerData);
    }
    if (this.carOwnerCount == 2) {
      this.ownerData.ownerDetails.push(this.coOwnerData);
      this.ownerData.ownerDetails.push(this.coOwner2Data);
    }


   if (buttonClicked == 'next') {      
             
        if (!this.checkDuplicatePesel() && !this.checkDuplicateRegOn()) {
          this.onNextClick();
          if (!this.hasErrors) { 
          this.nextDisa =true;
          this.sendMarketingConsentToCisl();
          this.saveUpdateMainOwner('mainOwner');
        }
      }
    }

    if (buttonClicked == 'back') {
      //this.saveMainOwnerDataToSession();
      this.saveMainOwner();
      this.saveCoOwner();
      this.saveCoOwner2();
      this.saveQuoteService.autoSavePageData();
      this.router.navigateByUrl('/carusage');
    }
  }
  onNextClick() {
    this.nextClicked = true;
    this.errors = 0;
    let event = { 'target': { 'value': '' } };
    if (this.mainOwner == '') {
      this.hasErrors = true;
    }
    if (!this.checkMandatoryFields("mainOwner") || !this.validPeselmo || !this.validRegonmo) {
      this.hasErrors = true;
      this.scrollToView(this.scrollEle);
     
    }
    if (this.carCoOwner && this.coOwner == '') {
      this.hasErrors = true;
     
    }
    if (this.carCoOwner2 && this.coOwner2 == '') {
      this.hasErrors = true;
    
    }
    if ((this.carCoOwner && !this.checkMandatoryFields("coOwner")) || !this.validPeselco || !this.validRegonco) {
      this.hasErrors = true;
      this.scrollToView(this.scrollEle);
     
    }
    if ((this.carCoOwner2 && !this.checkMandatoryFields("coOwner2")) || !this.validPeselco2 || !this.validRegonco2) {
      this.hasErrors = true;
      this.scrollToView(this.scrollEle);
     
    }
    if (this.email != '') {
      event.target.value = this.email;
      this.emailValidation(event);
      if (!this.isEmailValid) {
        this.hasErrors = true;
        
      }
    }
    if (this.phone != '') {
      event.target.value = this.phone;
      this.phoneValiation(event);
      if (!this.isPhoneValid) {
        this.hasErrors = true;
        
      }
    }
  }
  hideErrorPopup(data: any) {
    this.hasErrors = data;
  }
  resetErrors(owner) {
    switch (owner) {
      case 'mo':
        this.errMOPFN = false;
        this.errMOPSN = false;
        this.errMOPP = false;
        this.errMOPFamN = false;
        this.errMOSFN = false;
        this.errMOSSN = false;
        this.errMOSP = false;
        this.errMOSFamN = false;
        this.errMOSRegon = false;
        this.errMOCN = false;
        this.errMOCRegon = false;
        this.errMOBN = false;
        this.errMOBRegon = false;
        this.errMOLN = false;
        this.errMOLRegon = false;
        break;
      case 'co':
        this.errCOPFN = false;
        this.errCOPSN = false;
        this.errCOPP = false;
        this.errCOPFamN = false;
        this.errCOSFN = false;
        this.errCOSSN = false;
        this.errCOSP = false;
        this.errCOSFamN = false;
        this.errCOSRegon = false;
        this.errCOCN = false;
        this.errCOCRegon = false;
        this.errCOBN = false;
        this.errCOBRegon = false;
        this.errCOLN = false;
        this.errCOLRegon = false;
        break;
      case 'co2':
        this.errCO2PFN = false;
        this.errCO2PSN = false;
        this.errCO2PP = false;
        this.errCO2PFamN = false;
        this.errCO2SFN = false;
        this.errCO2SSN = false;
        this.errCO2SP = false;
        this.errCO2SFamN = false;
        this.errCO2SRegon = false;
        this.errCO2CN = false;
        this.errCO2CRegon = false;
        this.errCO2BN = false;
        this.errCO2BRegon = false;
        this.errCO2LN = false;
        this.errCO2LRegon = false;
        break;
      default:
    }
  }
  checkMandatoryFields(ownerType: any) {
    if (this.nextClicked == true) {
      if (ownerType == 'mainOwner') {
        var moErrors = 0;
        this.resetErrors('mo');
        if (this.mainOwner == 'PrivatePerson') {
          if (this.mainOwnerName == '' || this.mainOwnerName == null) {
            this.errMOPFN = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
          if (this.mainOwnerSurname == '' || this.mainOwnerSurname == null) {
            this.errMOPSN = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
          if (this.mainOwnerPesel == '' || this.mainOwnerPesel == null) {
            this.errMOPP = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
          if (this.mainOwnerIsWoman && (this.mainOwnerFamName == '' || this.mainOwnerFamName == null)) {
            this.errMOPFamN = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
        }
        if (this.mainOwner == 'SoleTrader') {
          if (this.mainOwnerSoleTraderName == '' || this.mainOwnerSoleTraderName == null) {
            this.errMOSFN = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
          if (this.mainOwnerSoleTraderSurname == '' || this.mainOwnerSoleTraderSurname == null) {
            this.errMOSSN = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
          if (this.mainOwnerSoleTraderPesel == '' || this.mainOwnerSoleTraderPesel == null) {
            this.errMOSP = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
          if (this.mainOwnerSoleTraderIsWoman && (this.mainOwnerSoleTraderFamName == '' || this.mainOwnerSoleTraderFamName == null)) {
            this.errMOSFamN = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
          if (this.mainOwnerSoleTraderRegon == '' || this.mainOwnerSoleTraderRegon == null) {
            this.errMOSRegon = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
        }
        if (this.mainOwner == 'Company') {
          if (this.mainOwnerCompName == '' || this.mainOwnerCompName == null) {
            this.errMOCN = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
          if (this.mainOwnerCompRegon == '' || this.mainOwnerCompRegon == null) {
            this.errMOCRegon = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
        }
        if (this.mainOwner == 'Bank') {
          if (this.mainOwnerBankName == '' || this.mainOwnerBankName == null) {
            this.errMOBN = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
          if (this.mainOwnerBankRegon == '' || this.mainOwnerBankRegon == null) {
            this.errMOBRegon = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
        }
        if (this.mainOwner == 'Leasing') {
          if (this.mainOwnerLeaseName == '' || this.mainOwnerLeaseName == null) {
            this.errMOLN = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
          if (this.mainOwnerLeaseRegon == '' || this.mainOwnerLeaseRegon == null) {
            this.errMOLRegon = true;
            if (this.errors == 0) {
              this.scrollToView("mo");
            }
            this.errors++;
            moErrors++;
          }
        }
        /* if (moErrors == 0 && this.carCoOwner) {
           //this.errors = 0;
           this.checkMandatoryFields("coOwner");
         }*/
      }
      if (ownerType == 'coOwner') {
        var coErrors = 0;
        this.resetErrors('co');
        if (this.coOwner == 'PrivatePerson') {
          if (this.coOwnerName == '' || this.coOwnerName == null) {
            this.errCOPFN = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
          if (this.coOwnerSurname == '' || this.coOwnerSurname == null) {
            this.errCOPSN = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
          if (this.coOwnerPesel == '' || this.coOwnerPesel == null) {
            this.errCOPP = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
          if (this.coOwnerIsWoman && (this.coOwnerFamName == '' || this.coOwnerFamName == null)) {
            this.errCOPFamN = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
        }
        if (this.coOwner == 'SoleTrader') {
          if (this.coOwnerSoleTraderName == '' || this.coOwnerSoleTraderName == null) {
            this.errCOSFN = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
          if (this.coOwnerSoleTraderSurname == '' || this.coOwnerSoleTraderSurname == null) {
            this.errCOSSN = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
          if (this.coOwnerSoleTraderPesel == '' || this.coOwnerSoleTraderPesel == null) {
            this.errCOSP = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
          if (this.coOwnerSoleTraderIsWoman && (this.coOwnerSoleTraderFamName == '' || this.coOwnerSoleTraderFamName == null)) {
            this.errCOSFamN = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
          if (this.coOwnerSoleTraderRegon == '' || this.coOwnerSoleTraderRegon == null) {
            this.errCOSRegon = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
        }
        if (this.coOwner == 'Company') {
          if (this.coOwnerCompanyName == '' || this.coOwnerCompanyName == null) {
            this.errCOCN = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
          if (this.coOwnerCompanyRegon == '' || this.coOwnerCompanyRegon == null) {
            this.errCOCRegon = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
        }
        if (this.coOwner == 'Bank') {
          if (this.coOwnerBankName == '' || this.coOwnerBankName == null) {
            this.errCOBN = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
          if (this.coOwnerBankRegon == '' || this.coOwnerBankRegon == null) {
            this.errCOBRegon = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
        }
        if (this.coOwner == 'Leasing') {
          if (this.coOwnerLeaseName == '' || this.coOwnerLeaseName == null) {
            this.errCOLN = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
          if (this.coOwnerLeaseRegon == '' || this.coOwnerLeaseRegon == null) {
            this.errCOLRegon = true;
            if (this.errors == 0) {
              this.scrollToView("co");
            }
            this.errors++;
            coErrors++;
          }
        }
        /*  if (coErrors == 0 && this.carCoOwner2) {
            //this.errors = 0;
            this.checkMandatoryFields("coOwner2");
          }*/
      }
      if (ownerType == 'coOwner2') {
        if (this.coOwner2 == 'PrivatePerson') {
          if (this.coOwner2Name == '' || this.coOwner2Name == null) {
            this.errCO2PFN = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
          if (this.coOwner2Surname == '' || this.coOwner2Surname == null) {
            this.errCO2PSN = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
          if (this.coOwner2Pesel == '' || this.coOwner2Pesel == null) {
            this.errCO2PP = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
          if (this.coOwner2IsWoman && (this.coOwner2FamName == '' || this.coOwner2FamName == null)) {
            this.errCO2PFamN = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
        }
        if (this.coOwner2 == 'SoleTrader') {
          if (this.coOwner2SoleTraderName == '' || this.coOwner2SoleTraderName == null) {
            this.errCO2SFN = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
          if (this.coOwner2SoleTraderSurname == '' || this.coOwner2SoleTraderSurname == null) {
            this.errCO2SSN = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
          if (this.coOwner2SoleTraderPesel == '' || this.coOwner2SoleTraderPesel == null) {
            this.errCO2SP = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
          if (this.coOwner2SoleTraderIsWoman && (this.coOwner2SoleTraderFamName == '' || this.coOwner2SoleTraderFamName == null)) {
            this.errCO2SFamN = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
          if (this.coOwner2SoleTraderRegon == '' || this.coOwner2SoleTraderRegon == null) {
            this.errCO2SRegon = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
        }
        if (this.coOwner2 == 'Company') {
          if (this.coOwner2CompanyName == '' || this.coOwner2CompanyName == null) {
            this.errCO2CN = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
          if (this.coOwner2CompanyRegon == '' || this.coOwner2CompanyRegon == null) {
            this.errCO2CRegon = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
        }
        if (this.coOwner2 == 'Bank') {
          if (this.coOwner2BankName == '' || this.coOwner2BankName == null) {
            this.errCO2BN = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
          if (this.coOwner2BankRegon == '' || this.coOwner2BankRegon == null) {
            this.errCO2BRegon = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
        }
        if (this.coOwner2 == 'Leasing') {
          if (this.coOwner2LeaseCompanyName == '' || this.coOwner2LeaseCompanyName == null) {
            this.errCO2LN = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
          if (this.coOwner2LeaseCompanyRegon == '' || this.coOwner2LeaseCompanyRegon == null) {
            this.errCO2LRegon = true;
            if (this.errors == 0) {
              this.scrollToView("co2");
            }
            this.errors++;
          }
        }
      }
    }
    if (this.errors > 0) {
      return false;
    } else {
      return true;
    }
  }
  scrollToView(ele) {
    this.scrollEle = ele;
    this[ele].nativeElement.scrollIntoView();
  }
  fillOwnerData(owner: any) {
    if (owner == "mainOwner") {
      let isMainOwnerWomen = "";
      if(this.mainOwnerIsWoman || this.mainOwnerSoleTraderIsWoman){
        isMainOwnerWomen = this.mainOwner == "PrivatePerson" ? this.mainOwnerFamName : this.mainOwnerSoleTraderFamName;
      }
      this.mainOwnerData.type = this.mainOwner;
      this.mainOwnerData.firstName = this.mainOwner == "PrivatePerson" ? this.mainOwnerName : this.mainOwnerSoleTraderName;
      this.mainOwnerData.surName = this.mainOwner == "PrivatePerson" ? this.mainOwnerSurname : this.mainOwnerSoleTraderSurname;
      this.mainOwnerData.peselId = this.mainOwner == "PrivatePerson" ? this.mainOwnerPesel : this.mainOwnerSoleTraderPesel;
      this.mainOwnerData.familyName = isMainOwnerWomen;
      this.mainOwnerData.regOn = this.mainOwnerSoleTraderRegon;
      this.mainOwnerData.companyName = this.mainOwnerCompName;
      this.mainOwnerData.companyRegOn = this.mainOwnerCompRegon;
      this.mainOwnerData.bankName = this.mainOwnerBankName;
      this.mainOwnerData.bankRegOn = this.mainOwnerBankRegon;
      this.mainOwnerData.leaseName = this.mainOwnerLeaseName;
      this.mainOwnerData.leaseRegOn = this.mainOwnerLeaseRegon;
      this.mainOwnerData.consent = this.consentsArr;
      this.mainOwnerData.questionCatelogueId = this.questionCatelogueId;
      this.mainOwnerData.selectAllConsent = this.selectedAllConsent;
      this.ownerData.ownerDetails[0] = this.mainOwnerData;
    }
    if (owner == "coOwner") {
      let isCoOwnerWomen = "";
      if(this.coOwnerIsWoman || this.coOwnerSoleTraderIsWoman){
        isCoOwnerWomen = this.coOwner == "PrivatePerson" ? this.coOwnerFamName : this.coOwnerSoleTraderFamName;
      }
      this.coOwnerData.type = this.coOwner;
      this.coOwnerData.firstName = this.coOwner == "PrivatePerson" ? this.coOwnerName : this.coOwnerSoleTraderName;
      this.coOwnerData.surName = this.coOwner == "PrivatePerson" ? this.coOwnerSurname : this.coOwnerSoleTraderSurname;
      this.coOwnerData.peselId = this.coOwner == "PrivatePerson" ? this.coOwnerPesel : this.coOwnerSoleTraderPesel;
      this.coOwnerData.familyName = isCoOwnerWomen;
      this.coOwnerData.regOn = this.coOwnerSoleTraderRegon;
      this.coOwnerData.companyName = this.coOwnerCompanyName;
      this.coOwnerData.companyRegOn = this.coOwnerCompanyRegon;
      this.coOwnerData.bankName = this.coOwnerBankName;
      this.coOwnerData.bankRegOn = this.coOwnerBankRegon;
      this.coOwnerData.leaseName = this.coOwnerLeaseName;
      this.coOwnerData.leaseRegOn = this.coOwnerLeaseRegon;
      this.ownerData.ownerDetails[1] = this.coOwnerData;
    }
    if (owner == "coOwner2") {
      let isCoOwner2Women = "";
      if(this.coOwner2IsWoman || this.coOwner2SoleTraderIsWoman){
        isCoOwner2Women = this.coOwner2 == "PrivatePerson" ? this.coOwner2FamName : this.coOwner2SoleTraderFamName;
      }
      this.coOwner2Data.type = this.coOwner2;
      this.coOwner2Data.firstName = this.coOwner2 == "PrivatePerson" ? this.coOwner2Name : this.coOwner2SoleTraderName;
      this.coOwner2Data.surName = this.coOwner2 == "PrivatePerson" ? this.coOwner2Surname : this.coOwner2SoleTraderSurname;
      this.coOwner2Data.peselId = this.coOwner2 == "PrivatePerson" ? this.coOwner2Pesel : this.coOwner2SoleTraderPesel;
      this.coOwner2Data.familyName = isCoOwner2Women;
      this.coOwner2Data.regOn = this.coOwner2SoleTraderRegon;
      this.coOwner2Data.companyName = this.coOwner2CompanyName;
      this.coOwner2Data.companyRegOn = this.coOwner2CompanyRegon;
      this.coOwner2Data.bankName = this.coOwner2BankName;
      this.coOwner2Data.bankRegOn = this.coOwner2BankRegon;
      this.coOwner2Data.leaseName = this.coOwner2LeaseCompanyName;
      this.coOwner2Data.leaseRegOn = this.coOwner2LeaseCompanyRegon;
      this.ownerData.ownerDetails[2] = this.coOwner2Data;
    }
  }

  getStoredData() {
    this.applicationData = JSON.parse(sessionStorage.getItem('Application'));
    let carUsageData = JSON.parse(sessionStorage.getItem('carusage'));
    if (!(sessionStorage.getItem('ownerData') == undefined || sessionStorage.getItem('ownerData') == null)) {
      this.sessionOwnerData = JSON.parse(sessionStorage.getItem('ownerData'));
      this.ownerData = JSON.parse(sessionStorage.getItem('ownerData'));
      this.applicationData.contractId = this.applicationData.contractId;
      this.ownerData.propertyId = this.applicationData.propertyId;
      if (this.ownerData.ownerDetails.length >= 1) {
        this.mainOwnerData = this.ownerData.ownerDetails[0];
      }
      if (this.ownerData.ownerDetails.length >= 2) {
        this.coOwnerData = this.ownerData.ownerDetails[1];
      }
      if (this.ownerData.ownerDetails.length == 3) {
        this.coOwner2Data = this.ownerData.ownerDetails[2];
      }

    }

    this.applicationData.contractId = this.applicationData.contractId;
    this.ownerData.propertyId = this.applicationData.propertyId;
    if (this.applicationData.owner) {
      this.mainOwnerData.emailChannelId = this.applicationData.owner.emailChannelId;
      this.mainOwnerData.phoneChannelId = this.applicationData.owner.phoneChannelId;
      this.email = this.applicationData.owner.email;
      this.phone = this.applicationData.owner.phone;
    }

    if (this.ownerData.ownerDetails.length >= 1) {
      if (this.mainOwnerData.type !== "") {
        this.carOwner = true;
      }

      this.consentsArr = this.mainOwnerData.consent !== undefined ? this.mainOwnerData.consent : [];
      this.selectedAllConsent = this.mainOwnerData.selectAllConsent;
      this.questionCatelogueId = this.mainOwnerData.questionCatelogueId;
      if (this.mainOwnerData.type == 'PrivatePerson') {
        this.mainOwnerName = this.mainOwnerData.firstName;
        this.mainOwnerSurname = this.mainOwnerData.surName;
        this.mainOwnerPesel = this.mainOwnerData.peselId;
        this.mainOwnerFamName = this.mainOwnerData.familyName;
        this.mainOwnerIsWoman = this.mainOwnerData.familyName !== "" ? true : false;
        this.mainOwner = this.mainOwnerData.type;
      }
      else if (this.mainOwnerData.type == 'SoleTrader') {
        this.mainOwnerSoleTraderName = this.mainOwnerData.firstName;
        this.mainOwnerSoleTraderSurname = this.mainOwnerData.surName;
        this.mainOwnerSoleTraderPesel = this.mainOwnerData.peselId;
        this.mainOwnerSoleTraderFamName = this.mainOwnerData.familyName;
        this.mainOwnerSoleTraderIsWoman = this.mainOwnerData.familyName !== "" ? true : false;
        this.mainOwner = this.mainOwnerData.type;
        this.mainOwnerSoleTraderRegon = this.mainOwnerData.regOn;
      }
      else if (this.mainOwnerData.type == 'Company') {
        this.mainOwnerCompName = this.mainOwnerData.companyName;
        this.mainOwnerCompRegon = this.mainOwnerData.companyRegOn;
        this.mainOwner = this.mainOwnerData.type;
      }
      else if (this.mainOwnerData.type == 'Bank') {
        this.mainOwnerBankName = this.mainOwnerData.bankName;
        this.mainOwnerBankRegon = this.mainOwnerData.bankRegOn;
        this.mainOwner = this.mainOwnerData.type;
      }
      else if (this.mainOwnerData.type == 'Leasing') {
        this.mainOwnerLeaseName = this.mainOwnerData.leaseName;
        this.mainOwnerLeaseRegon = this.mainOwnerData.leaseRegOn;
        this.mainOwner = this.mainOwnerData.type;
      }

      if (this.consentsArr.length == 0) {
        this.getMarketingConsentsFromCisl();
      }
    } else {
      this.getMarketingConsentsFromCisl();
    }
    if (this.ownerData.ownerDetails.length >= 2) {
      if (this.coOwnerData.type !== "") {
        this.carCoOwner = true;
      }

      if (this.coOwnerData.type == 'PrivatePerson') {
        this.coOwnerName = this.coOwnerData.firstName;
        this.coOwnerSurname = this.coOwnerData.surName;
        this.coOwnerPesel = this.coOwnerData.peselId;
        this.coOwnerFamName = this.coOwnerData.familyName;
        this.coOwnerIsWoman = this.coOwnerData.familyName !== "" ? true : false;
        this.coOwner = this.coOwnerData.type;
      }
      else if (this.coOwnerData.type == 'SoleTrader') {
        this.coOwnerSoleTraderName = this.coOwnerData.firstName;
        this.coOwnerSoleTraderSurname = this.coOwnerData.surName;
        this.coOwnerSoleTraderPesel = this.coOwnerData.peselId;
        this.coOwnerSoleTraderFamName = this.coOwnerData.familyName;
        this.coOwnerSoleTraderIsWoman = this.coOwnerData.familyName !== "" ? true : false;
        this.coOwnerSoleTraderRegon = this.coOwnerData.regOn;
        this.coOwner = this.coOwnerData.type;
      }
      else if (this.coOwnerData.type == 'Company') {
        this.coOwnerCompanyName = this.coOwnerData.companyName;
        this.coOwnerCompanyRegon = this.coOwnerData.companyRegOn;
        this.coOwner = this.coOwnerData.type;
      }
      else if (this.coOwnerData.type == 'Bank') {
        this.coOwnerBankName = this.coOwnerData.bankName;
        this.coOwnerBankRegon = this.coOwnerData.bankRegOn;
        this.coOwner = this.coOwnerData.type;
      }
      else if (this.coOwnerData.type == 'Leasing') {
        this.coOwnerLeaseName = this.coOwnerData.leaseName;
        this.coOwnerLeaseRegon = this.coOwnerData.leaseRegOn;
        this.coOwner = this.coOwnerData.type;
      }
    }
    if (this.ownerData.ownerDetails.length == 3) {
      if (this.coOwner2Data.type !== "") {
        this.carCoOwner2 = true;
      }
      if (this.coOwner2Data.type == 'PrivatePerson') {
        this.coOwner2Name = this.coOwner2Data.firstName;
        this.coOwner2Surname = this.coOwner2Data.surName;
        this.coOwner2Pesel = this.coOwner2Data.peselId;
        this.coOwner2FamName = this.coOwner2Data.familyName;
        this.coOwner2IsWoman = this.coOwner2Data.familyName !== "" ? true : false;
        this.coOwner2 = this.coOwner2Data.type;
      }
      else if (this.coOwner2Data.type == 'SoleTrader') {
        this.coOwner2SoleTraderName = this.coOwner2Data.firstName;
        this.coOwner2SoleTraderSurname = this.coOwner2Data.surName;
        this.coOwner2SoleTraderPesel = this.coOwner2Data.partyId;
        this.coOwner2SoleTraderFamName = this.coOwner2Data.familyName;
        this.coOwner2SoleTraderIsWoman = this.coOwner2Data.familyName !== "" ? true : false;
        this.coOwner2SoleTraderRegon = this.coOwner2Data.roleId;
        this.coOwner2 = this.coOwner2Data.type;
      }
      else if (this.coOwner2Data.type == 'Company') {
        this.coOwner2CompanyName = this.coOwner2Data.companyName;
        this.coOwner2CompanyRegon = this.coOwner2Data.companyRegOn;
        this.coOwner2 = this.coOwner2Data.type;
      }
      else if (this.coOwner2Data.type == 'Bank') {
        this.coOwner2BankName = this.coOwner2Data.bankName;
        this.coOwner2BankRegon = this.coOwner2Data.bankRegOn;
        this.coOwner2 = this.coOwner2Data.type;
      }
      else if (this.coOwner2Data.type == 'Leasing') {
        this.coOwner2LeaseCompanyName = this.coOwner2Data.leaseName;
        this.coOwner2LeaseCompanyRegon = this.coOwner2Data.leaseRegOn;
        this.coOwner2 = this.coOwner2Data.type;
      }
    }
    this.showHideButtons();
  }
  showHideButtons() {
    if (this.carCoOwner2) {
      this.carOwnerCount = 2;
      return;
    } else if (this.carCoOwner) {
      this.carOwnerCount = 1;
      return;
    } else if (this.carOwner) {
      this.carOwnerCount = 0;
    }
  }
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


  trackownershiptype() {


    /* ********************DO-NOT-TOUCH-CAR-OWNERSHIP-TYPE***************************************** */

    /* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
    AEMSet('digitalData.quote.quoteData.carOwnerShip.carOwnerShipType', this.mainOwner);
   
    /* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

    /* ************************DO-NOT-TOUCH****************************************** */








  }

  //resetMainOwnerFields(){}
}