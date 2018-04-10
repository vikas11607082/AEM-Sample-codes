import { Component, ViewChild, ElementRef, OnInit, Renderer } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CislService } from '../../util/util.cisl.service';
import { Router } from '@angular/router';
import { UrlSerializer } from '@angular/router';
import { CustomUrlSerializer } from '../../commons/customurl/customUrlSerializer';
import { ErrorPopUp } from '../../commons/popup/popup.component';
import { CallPopUp } from '../../commons/popup/callcenterpopup.component';
import { errorMsgs } from '../../commons/error/errorMessages';
import { SaveQuoteService } from '../../savequote/quote.save.service';
import { SaveButtonHideShowService } from '../../savequote/save.button.hide.show.service';
import { AEMSet, AEMTrack,AEMClearVars } from '../../commons/analytics';


declare var window: any;

@Component({

    templateUrl: '../html/quote.carusage.component.html',
    entryComponents: [ErrorPopUp, CallPopUp],
    styles: [`
    ng2-auto-complete {
      width: 100%;
    }
  `]

})
export class CarUsageComponent implements OnInit {

    @ViewChild('tooltip') tooltip: ElementRef; // Added for tooltip
    @ViewChild('dropDownCountryRegistration') dropDownCountryRegistration: ElementRef   // Added for dropdown
    @ViewChild('dropDownWhatpurpose') dropDownWhatpurpose: ElementRef //Added for dropdown
    @ViewChild('dropDownPlanYearlyMileage') dropDownPlanYearlyMileage: ElementRef   // Added for dropdown    
    @ViewChild('progressbarActive') progressbarActive: ElementRef;
    @ViewChild('dropDownStreet') dropDownStreet: ElementRef;
    @ViewChild('currentMileageInput') currentMileageInput: ElementRef;
    @ViewChild('yearOfReg') yearOfReg: ElementRef;
    @ViewChild('countryOfReg') countryOfReg: ElementRef;
    @ViewChild('carOwnDate') carOwnDate: ElementRef;
    @ViewChild('currentMileageEle') currentMileageEle: ElementRef;
    @ViewChild('plannedMileage') plannedMileage: ElementRef;
    @ViewChild('purpose') purpose: ElementRef;
    @ViewChild('useAbroad') useAbroad: ElementRef;
    @ViewChild('importedInMonths') importedInMonths: ElementRef;
    @ViewChild('zipCodeEle') zipCodeEle: ElementRef;
    @ViewChild('parkingNight') parkingNight: ElementRef;


    constructor(private _fb: FormBuilder, private cislService: CislService, private router: Router, private renderer: Renderer,
        private saveQuoteService: SaveQuoteService, private _saveButtonShowHide: SaveButtonHideShowService) { }

    dateFirstRegNull: boolean = false;
    errorMsgDateFirstReg: string;
    countryRegNull: boolean = false;
    errorMsgCountryReg: string;
    carOwnedDateNull: boolean = false;
    errorMsgCarOwnedDate: string;
    currentMileageNull: boolean = false;
    errorMsgCurrentMileage: string;
    selPlanMileageNull: boolean = false;
    errorMsgSelPlanMileage: string;
    selWhatPurposeNull: boolean = false;
    errorMsgSelWhatPurpose: string;
    carUsedAbroadNull: boolean = false;
    errorMsgCarUsedAbroad: string;
    carImportNull: boolean = false;
    errorMsgCarImport: string;
    zipCodeNull: boolean = false;
    errorMsgZipCodeNull: string;
    zipCodeInvalid: boolean = false;
    errorMsgZipCodeInvalid: string;
    parkingDuringNightsNull: boolean = false;
    errorMsgParking: string;
    carOwnedDateInvalid: boolean = false;
    dateFirstRegInvalid: boolean = false;
    errorMsgCarOwnedDateInvalid: string;
    errorMsgDateFirstRegInvalid: string;

    nextClicked: boolean = false;
    hasErrors: boolean = false;


    public isNextDisable: boolean = true;

    public plateNo = null;

    public firstRegistration = '';
    public carImportedInMonths = '';
    public parkingDuringNights = '';
    public countryFirstRegistration = '';
    public sinceOwnYourCar = '';
    public whatPurpose = '';
    public carUsedAbroad = '';
    public currentMileage = '';
    public plannedYearlyMileage = '';
    public productionYear;
    public dateFirstRegistration: string = "Wybierz";
    public carOwnedDate = '';
    public zipCode = '';
    public street = '';
    public street1 = '';
    public years: string[] = [];
    public carOwnYears: number[] = [];
    public yy: number;
    carAbroadValues = [];
    parkingNightValues = [];
    zipCodeValues = [];
    tempFlagForZipcode = 0;
    townValues = [];
    townValuesArray = [];
    streetValues = [];
    showStreet = [];
    streetValues1 = [];
    selectedPlanedMileage = "Wybierz"; //Todo after translation problem is resolved  en: choose
    countryReg: boolean = false;
    validateZipValue: boolean;
    minYear: number;
    maxYear = new Date().getFullYear + '';
    contractId: string = '';
    propertyId: string = '';
    firstRegDate: string = "Wybierz"; //Todo after translation problem is resolved  en: choose
    carOwnedFromDate: string = "Wybierz";
    selectedStreet1: string = "Ulica";  //Todo after translation problem is resolved  en: street
    selectedStreet: string = "Wybierz swój kod pocztowy";
    selectedTown: String = "Miasto";  //Todo after translation problem is resolved  en: town
    searchValues: string;
    streetEvent: any;
    public selectedVal = "";
    carPurposeMap = new Object();
    carAbroadValuesMap = new Object();
    countryRegistrationMap = new Object();
    PlannedYearlyMileageMap = new Object();
    parkingDuringNightsMap = new Object();
    public sessionStoredData: any;
    x: any;
    public value = '';
    public consentsArr = [];
    public selectedAllConsent: boolean;
    public isMarketingConsentChecked: boolean = false;
    public consentsId = 'AZONLINE_CARUSAGE';
    public questionCatelogueId: String = '';
    public inputStreet: any;
    public applicationData: any;
    public mileageValue: any;

    public townNameMatched: string = "";
    public streetNameMatched: string = "";

    private currentPageId: number = 2;
    private showSaveButton: boolean = false;

    public parkingDuringNightsValues: String = "";
    public carUsedAbroadValue: String = "";

    public plannedYearlyMileageValue: String = "";

    public disabledNext: boolean = false;


    ngOnInit() {
        var today = new Date();
        this.yy = today.getFullYear();
        this.getStoredData();
        this.getFirstRegistrationYears();
        this.getDataForUsage();
        this.dropDownPlanYearlyMileage.nativeElement.classList.add("is-not-visible");

        this.saveQuoteService.currentPageId = this.currentPageId;
        this.saveQuoteService.SaveQuote.subscribe(() => {
            if (this.saveQuoteService.currentPageId == this.currentPageId) {
                this.applicationData = JSON.parse(sessionStorage.getItem('Application'));
                this.saveData();
            }

        });



        /* ********************DO-NOT-TOUCH-SAVE-QUOTE-ID***************************************** */
        var trackQuoteData = JSON.parse(sessionStorage.getItem('Application'));
        var quoteIDData = trackQuoteData.quoteId;
        /* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
        AEMSet('digitalData.quoteTransactionID', quoteIDData);
      
        /* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

        /* ************************DO-NOT-TOUCH****************************************** */


        this._saveButtonShowHide.showQuoteId();
        this._saveButtonShowHide.showSaveButton();

        /*code to get current pageName and pageID and send it to adobe analytics*/

        var path = window.location.href;
        var pageData = path.split("#/");
      
        var currentPageName = pageData[1];
      

        if (currentPageName == "carusage") {
            var pageName = "Car Usage";
            var pageID = "car/S2carUsage:Step2";

            /*Analytics tracking for  carusage page */

            /*		if(window && window.om.core.tracking.addSPAEvent) {
                  window.om.core.tracking.addSPAEvent('spapageview', 'onload', {'pageInfo':{'pageName': pageName,'pageID': pageID }}); // add event to the datalayer
                window._satellite.track('spapageview'); // trigger dynamic tag manager
                    }*/

            /*Analytics tracking for carusage page end:*/

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
    }

    getDataForUsage() {
        this.cislService.getDataFromCislDatalistType("COUNTRY_OF_FIRST_REGISTRATION").subscribe(data => this.serializeCountryRegistration(data));
        this.cislService.getDataFromCislDatalistType("USAGE_TYPE").subscribe(data => this.serializeCarPurpose(data));
        this.cislService.getDataFromCislDatalistType("PLANNED_MILEAGE").subscribe(data => this.serializePlanYearlyMileage(data));
        this.cislService.getDataFromCislDatalistType("DRIVE_ABROAD").subscribe(data => this.serializeCarAbroad(data));
        this.cislService.getDataFromCislDatalistType("PARKING_PLACE_NIGHT").subscribe(data => this.serializeParkingDuringNights(data));
    }
    /*setContractId(data){
        let res = JSON.parse(data);
        this.contractId = res._body;        
    }*/
    getPropertyId() {
        let reqParams = { "contractId": this.contractId, "licensePlateNumber": this.plateNo }
        this.cislService.getPropertyIdFromCisl(reqParams).subscribe(data => { this.setPropertyId(data) });
    }
    isLicencePlateChanged() {
        if (this.sessionStoredData.licence == this.plateNo) {
            return false;
        } else {
            return true;
        }
    }
    setPropertyId(data) {
        this.propertyId = data;
        this.saveAndRouteToNext();
    }
    /*Start Cisl services call */
    serializeCountryRegistration(data: any) {
        let countryData = data.options;
        this.countryRegistration = [];
        for (let i = 0; i < countryData.length; i++) {
            this.countryRegistration.push(countryData[i].label);
            this.countryRegistrationMap[countryData[i].label] = countryData[i].value;

            if (this.selectedCountryRegistration == countryData[i].value) {
                this.selectedCountryRegistration = countryData[i].label;
            }
        }

        if (this.selectedCountryRegistration == "") {
            this.selectedCountryRegistration = "Wybierz";
        }
    }
    serializeCarPurpose(data: any) {
        let carPurposeData = data.options;
        this.carPurpose = [];
        for (let i = 0; i < carPurposeData.length; i++) {
            this.carPurpose.push(carPurposeData[i].label);
            this.carPurposeMap[carPurposeData[i].label] = carPurposeData[i].value;
            if (carPurposeData[i].value == this.purposeValue) {
                this.selectedWhatPurpose = carPurposeData[i].label;
            }
        }

        if (this.selectedWhatPurpose == "") {
            this.selectedWhatPurpose = "Wybierz";
        }
    }
    serializePlanYearlyMileage(data: any) {
        let planYearlyMileageData = data.options;
        this.PlannedYearlyMileage = [];
        for (let i = 0; i < planYearlyMileageData.length; i++) {
            this.PlannedYearlyMileage.push(planYearlyMileageData[i].label);
            this.PlannedYearlyMileageMap[planYearlyMileageData[i].label] = planYearlyMileageData[i].value;

            if (this.plannedYearlyMileageValue == planYearlyMileageData[i].value) {
                this.selectedPlanedMileage = planYearlyMileageData[i].label;
            }
        }

        if (this.selectedPlanedMileage == "") {
            this.selectedPlanedMileage = "Wybierz";
        }
    }
    serializeCarAbroad(data: any) {
        let carAbroadData = data.options;
        for (let i = 0; i < carAbroadData.length; i++) {
            this.carAbroadValues.push(carAbroadData[i].label);
            this.carAbroadValuesMap[carAbroadData[i].label] = carAbroadData[i].value;

            if (this.carUsedAbroadValue == carAbroadData[i].value) {
                this.carUsedAbroad = carAbroadData[i].label;
            }
        }
    }
    serializeParkingDuringNights(data: any) {
        let parkingnightData = data.options;
        for (let i = 0; i < parkingnightData.length; i++) {
            this.parkingNightValues.push(parkingnightData[i].label);
            this.parkingDuringNightsMap[parkingnightData[i].label] = parkingnightData[i].value;

            if (parkingnightData[i].value == this.parkingDuringNightsValues) {
                this.parkingDuringNights = parkingnightData[i].label;
            }
        }
    }
    serializeZipCode(data: any, val: string): void {
        if (data.options) {
            if (data.options[0].value === val) {
                this.validateZipValue = true;

            } else {
                this.validateZipValue = false;
            }
        } else {
            this.validateZipValue = false;
        }
    }
    serializeTown(data: any, val, event) {
        let townData = data.options;
        this.townValues = [];
        this.townValuesArray = [];
        if (townData) {
            for (let i = 0; i < townData.length; i++) {
                this.townValues.push(townData[i].label);
                this.townValuesArray.push(townData[i].value);
                this.townNameMatched = val;
            }
        } else {
            if (this.townNameMatched != val && this.townNameMatched !== '') {
                event.target.value = this.townNameMatched;
                //this.selectedTown = event.target.value;            
                this.getTownData(event);
            }

        }
    }
    serializeStreet(data: any, val, event) {
        let streetData = data.options;
        this.streetValues = [];
        this.streetValues1 = [];
        if (streetData != undefined) {
            for (let i = 0; i < streetData.length; i++) {
                this.streetValues1.push(streetData[i].label);
                this.streetValues.push(streetData[i].value.split('|').join(','));
                this.streetNameMatched = val;
            }
        } else {
            if (this.streetNameMatched != val && this.streetNameMatched !== '') {
                event.target.value = this.streetNameMatched;
                this.getStreet1Data(event);
            }

        }
        this.showStreet = this.streetValues;
    }
    resetCountryRegistration() {
        this.carImported = false;
        this.selectedCountryRegistration = null;
        this.isMandatoryValidation();
    }
    /*start Check Mandatory field*/
    isMandatoryValidation() {
        if (this.nextClicked) {
            var error = 0;
            this.dateFirstRegNull = false;
            this.carImportNull = false;
            this.carOwnedDateNull = false;
            this.countryRegNull = false;
            this.selWhatPurposeNull = false;
            this.zipCodeNull = false;
            this.zipCodeInvalid = false;
            this.carUsedAbroadNull = false;
            this.currentMileageNull = false;
            this.selPlanMileageNull = false;
            this.parkingDuringNightsNull = false;
            if (this.dateFirstRegistration == 'Wybierz') {
                this.dateFirstRegNull = true;
                //this.errorMsgDateFirstReg = errorMsgs.noSelection;
                if (error == 0) {
                    this.scrollToView('yearOfReg');
                }
                error++;
            }
            if (this.carImportedInMonths == '') {
                this.carImportNull = true;
                //this.errorMsgCarImport  = errorMsgs.noSelection;
                if (error == 0) {
                    this.scrollToView('importedInMonths');
                }
                error++;
            }
            if (this.carImportedInMonths != '' && this.selectedCountryRegistration == "Wybierz") {
                this.countryRegNull = true;
                //this.errorMsgCountryReg = errorMsgs.noSelection;
                if (error == 0) {
                    this.scrollToView('countryOfReg');
                }
                error++;
            }
            if (this.carOwnedDate == 'Wybierz') {
                this.carOwnedDateNull = true;
                //this.errorMsgCarOwnedDate = errorMsgs.noSelection;
                if (error == 0) {
                    this.scrollToView('carOwnDate');
                }
                error++;
            }
            if (this.selectedWhatPurpose == "Wybierz") {
                this.selWhatPurposeNull = true;
                //this.errorMsgSelWhatPurpose = errorMsgs.noSelection;
                if (error == 0) {
                    this.scrollToView('purpose');
                }
                error++;
            }
            if (this.parkingDuringNights == '') {
                this.parkingDuringNightsNull = true;
                //this.errorMsgParking = errorMsgs.noSelection;
                if (error == 0) {
                    this.scrollToView('parkingNight');
                }
                error++;
            }
            if (this.zipCode == '') {
                this.zipCodeNull = true;
                //this.errorMsgZipCodeNull = errorMsgs.noInput;
                if (error == 0) {
                    this.scrollToView('zipCodeEle');
                }
                error++;
            }
            if (this.zipCode !== '' && this.validateZipValue !== true) {
                this.zipCodeInvalid = true;
                //this.errorMsgZipCodeInvalid = errorMsgs.dataInvalid;
                if (error == 0) {
                    this.scrollToView('zipCodeEle');
                }
                error++;
            }
            if (this.carUsedAbroad == '') {
                this.carUsedAbroadNull = true;
                //this.errorMsgCarUsedAbroad = errorMsgs.noSelection;
                if (error == 0) {
                    this.scrollToView('useAbroad');
                }
                error++;
            }
            if (this.currentMileage == '') {
                this.currentMileageNull = true;
                this.errorMsgCurrentMileage = errorMsgs.noInput;
                if (error == 0) {
                    this.scrollToView('currentMileageEle');
                }
                error++;
            }
            if (this.selectedPlanedMileage == "Wybierz") {
                this.selPlanMileageNull = true;
                //this.errorMsgSelPlanMileage = errorMsgs.noSelection;
                if (error == 0) {
                    this.scrollToView('plannedMileage');
                }
                error++;
            }
            /* if(parseInt(this.dateFirstRegistration) < parseInt(this.carOwnedDate)){
                 this.carOwnedDateInvalid = true;
                 this.dateFirstRegInvalid = true;
                 this.errorMsgCarOwnedDateInvalid = errorMsgs.dataInvalid;
                 this.errorMsgDateFirstRegInvalid = errorMsgs.dataInvalid;
                 if(error == 0){
                     this.scrollToView('yearOfReg');
                 }
                 error++;
             }*/
            if (error > 0) {
                return false;
            } else {
                return true;
            }
        }
    }
    scrollToView(element) {
        this[element].nativeElement.scrollIntoView();
    }
    hideErrorPopup(data: any) {
        this.hasErrors = data;
    }
    /* Start car import last 12 month */
    carImported: boolean;
    carImportedStatus: String;
    showcarImported(): void {
        this.carImported = true;
        this.carImportedStatus = "Yes";
        this.selectedCountryRegistration = "Wybierz"; //Todo after translation problem is resolved  en: 
        this.isMandatoryValidation();
        /* ********************DO-NOT-TOUCH-CAR-IMPORTED-STATUS***************************************** */

        /* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
        AEMSet('digitalData.quote.quoteData.carImported.carImportedStatus', this.carImportedStatus);
     

        /* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

        /* ************************DO-NOT-TOUCH****************************************** */



    }
    hidecarImported(): void {
        this.carImported = false;
        this.carImportedStatus = "NO";
        this.isMandatoryValidation();

        /* ********************DO-NOT-TOUCH-CAR-IMPORTED-STATUS***************************************** */

        /* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
        AEMSet('digitalData.quote.quoteData.carImported.carImportedStatus', this.carImportedStatus);
    

        /* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

        /* ************************DO-NOT-TOUCH****************************************** */
    }
    /*code added for progress bar ends*/
    addClass(event): void {
        event.target.classList.add('is-filled');

    }
    removeClass(event): void {
        if (event.target.classList.contains('ng-invalid')) {
            event.target.classList.add('is-filled');
        }
    }
    /*Added for tooltip*/
    addClassTooltip(tooltip, tooltippopup, event): void {
        tooltip.classList.add('has-open-tooltip');
        tooltip.setAttribute("aria-expanded", "true");
        tooltippopup.setAttribute("aria-hidden", "true");
        tooltippopup.classList.add('is-open');
        event.preventDefault();
    }
    removeClassTooltip(tooltip, tooltippopup, event): void {
        tooltip.classList.remove('has-open-tooltip');
        tooltip.setAttribute("aria-expanded", "false");
        tooltippopup.setAttribute("aria-hidden", "false");
        tooltippopup.classList.remove('is-open');
        event.preventDefault();
    }
    /* Added for License Plate Number */
    omit_special_char(event) {
        var k;
        var val = false;
        k = event.charCode;
        if (k == 32)
            return val;
        else
            return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 0 || k == 32 || (k >= 48 && k <= 57));
    }

    onKeyLicensePlate(event: any) {
        this.plateNo = event.target.value;
    }

    /* Added for Country Registration DropDown*/
    selectedCountryRegistration = "Wybierz"; //Todo after translation problem is resolved  en: choose
    CountryRegistrationInputValue = '';
    countryRegistration = [];
    showCountryRegistration = this.countryRegistration;

    showDropDownCountryOfRegistration(ele: any, event, eleSpan: any): void {
        event.stopPropagation();
        ele.classList.remove("is-not-visible");
        ele.classList.add("is-open");
        eleSpan.classList.add("c-icon--chevron-down");
        eleSpan.classList.add("is-open");
        ele.style.display = "block";
    }
    onKeyCountryRegistration(event: any) {
        var typedVal = event.target.value;
        var newArray = [];
        var p = 0;
        var toShowFull = 0;
        if (typedVal != '') {
            for (var i = 0; i < this.countryRegistration.length; i++) {
                if (typedVal.length < this.countryRegistration[i].length) {
                    if (this.countryRegistration[i].substring(0, typedVal.length) == typedVal) {
                        newArray[p++] = this.countryRegistration[i];
                    }
                }
            }
            this.showCountryRegistration = newArray;
        } else {
            this.showCountryRegistration = this.countryRegistration;
        }

    }
    hideDropDownCountryRegistration(ele: any, sel: any, event, eleSpan: any): void {
        this.selectedCountryRegistration = sel;
        ele.classList.add("is-open");
        eleSpan.classList.add("c-icon--chevron-up");
        eleSpan.classList.remove("is-open");
        ele.style.display = "none";
        this.isMandatoryValidation();
        event.stopPropagation();

        /* ********************DO-NOT-TOUCH-CAR-COUNTRY-OF-FIRST-REGISTRATION***************************************** */

        /* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
        AEMSet('digitalData.quote.quoteData.carImported.carCountryFirstRegistration', this.selectedCountryRegistration);
     
        /* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

        /* ************************DO-NOT-TOUCH****************************************** */
    }
    /*Start Zip code*/
    validateZip(event): void {
        this.validateZipValue = false;
        let val = event.target.value;
        let leng = val.length;
        if (val.length == 2 && event.keyCode !== 8) {
            event.target.value = val.substring(0, 2) + "-" + val.slice(3, 6);
        }
        if (leng == 5) {
            if (val.indexOf("-") === -1) {
                event.target.value = val.substring(0, 2) + "-" + val.substring(2, 5);
            }
        }
        if (leng == 6) {
            if (val.indexOf("-") === -1) {
                event.target.value = val.substring(0, 2) + "-" + val.slice(3, 6);
            }
            this.validateZipValue = true;
            this.getZipListAndValidate(val);
        } else {
            this.validateZipValue = false;
        }
    }
    getZipListAndValidate(val: string): void {
        this.cislService.getDataFromCislZipCodeData(val).subscribe(data => this.serializeZipCode(data, val));
    }
    zipAcceptOnlyNumbers(event) {
        let k = event.charCode;
        let val = false;
        if ((k >= 48 && k <= 57) || k == 0) {
            if (k == 45 && this.tempFlagForZipcode == 0) {
                this.tempFlagForZipcode = 1;
                return val;
            } else {
                return;
            }
        } else {
            return val;
        }
    }
    /* Start For What Purpose Dropdown*/
    selectedWhatPurpose = "Wybierz"; //Todo after translation problem is resolved  en: choose
    carPurpose = [];
    showWhatPurpose = this.carPurpose;
    purposeValue = "";
    showDropDownWhatPurposeCar(event, ele: any, eleSpan: any): void {
        event.stopPropagation();
        ele.classList.remove("is-not-visible");
        ele.classList.add("is-open");
        eleSpan.classList.add("c-icon--chevron-down");
        eleSpan.classList.add("is-open");
        ele.style.display = "block";
    }
    onKeyWhatPurpose(event: any) {
        var typedVal = event.target.value;
        var newArray = [];
        var p = 0;
        var toShowFull = 0;
        if (typedVal != '') {
            for (var i = 0; i < this.carPurpose.length; i++) {
                if (typedVal.length < this.carPurpose[i].length) {
                    if (this.carPurpose[i].substring(0, typedVal.length) == typedVal) {
                        newArray[p++] = this.carPurpose[i];
                    }
                }
            }
            this.showWhatPurpose = newArray;
        } else {
            this.showWhatPurpose = this.carPurpose;
        }
    }
    hideDropDownWhatPurpose(ele: any, sel: any, eleSpan: any, event): void {
        this.selectedWhatPurpose = sel;
        event.stopPropagation();
        ele.classList.add("is-open");
        eleSpan.classList.add("c-icon--chevron-up");
        eleSpan.classList.remove("is-open");
        ele.style.display = "none";
        this.isMandatoryValidation();

        /* ********************DO-NOT-TOUCH-CAR-WHAT-PURPOSE***************************************** */

        /* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
        AEMSet('digitalData.quote.quoteData.purposeOfUseOfCar', this.selectedWhatPurpose);
       

        /* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

        /* ************************DO-NOT-TOUCH****************************************** */


    }
    /*Start Planned Yearly Milage*/
    PlannedYearlyMileage = [];
    showPlannedMileage = this.PlannedYearlyMileage;
    showDropDownPlannedMileage(ele: any, event, eleSpan: any): void {
        event.stopPropagation();
        ele.classList.remove("is-not-visible");
        ele.classList.add("is-open");
        eleSpan.classList.add("c-icon--chevron-down");
        eleSpan.classList.add("is-open");
        ele.style.display = "block";
    }
    onKeyPlanYearlyMileage(event: any) {
        var typedVal = event.target.value;
        var newArray = [];
        var p = 0;
        var toShowFull = 0;
        if (typedVal != '') {

            for (var i = 0; i < this.PlannedYearlyMileage.length; i++) {
                if (typedVal.length < this.PlannedYearlyMileage[i].length) {
                    if (this.PlannedYearlyMileage[i].substring(0, typedVal.length) == typedVal) {
                        newArray[p++] = this.PlannedYearlyMileage[i];
                    }
                }
            }
            this.showPlannedMileage = newArray;
        } else {
            this.showPlannedMileage = this.PlannedYearlyMileage;
        }
    }
    hideDropDowndropDownPlanYearlyMileage(ele: any, sel: any, eleSpan: any, event): void {
        this.selectedPlanedMileage = sel;
        event.stopPropagation();
        ele.classList.add("is-open");
        eleSpan.classList.add("c-icon--chevron-up");
        eleSpan.classList.remove("is-open");
        ele.style.display = "none";
        this.isMandatoryValidation();
        /* ********************DO-NOT-TOUCH-Planned-yearly-mileage***************************************** */

        /* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
        AEMSet('digitalData.quote.quoteData.carPlannedMileage', this.selectedPlanedMileage);
     

        /* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

        /* ************************DO-NOT-TOUCH****************************************** */


    }


    /*Start for zipcode Help me find out*/
    helpMeFindOut(helpMeFindZip, helpMeFindZipPopup, event, inputTown) {
        this.selectedTown = "Miasto";
        this.selectedStreet1 = "Ulica";
        this.selectedStreet = "Wybierz swój kod pocztowy";
        this.townValues = [];
        this.showStreet = [];
        this.searchValues = null;
        event.stopPropagation();
        helpMeFindZip.classList.add('has-open-tooltip');
        helpMeFindZipPopup.classList.add('is-open');
    }
    confirmZip(helpMeFindZip, helpMeFindZipPopup, event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
        helpMeFindZip.classList.add('has-open-tooltip');
        helpMeFindZipPopup.classList.remove('is-open');
        let str = this.selectedStreet.split(',');
        this.zipCode = (str[str.length - 1]);
        if (this.zipCode == 'Ulica') {
            this.zipCode = '';
        }
        this.validateZipValue = false;
        let val = this.zipCode;
        let leng = val.length;
        if (leng == 6) {
            this.validateZipValue = true;
            this.getZipListAndValidate(val);
        } else {
            this.validateZipValue = false;
        }
    }
    hideHelpMeFindOut(helpMeFindZip, helpMeFindZipPopup, event) {
        event.stopPropagation();
        helpMeFindZip.classList.remove('has-open-tooltip');
        helpMeFindZipPopup.classList.remove('is-open');
    }
    hideDropDownTown(ele: any, event, sel): void {
        this.selectedTown = sel;
        ele.classList.remove("is-opened");
        ele.classList.add("is-filled");
        event.stopPropagation();
    }
    showDDStreet1(ele: any): void {
        if (this.selectedTown != 'Miasto' && this.selectedTown != '') {
            ele.classList.remove("is-filled");
            ele.classList.add("is-opened");
        }
    }
    showDDStreet(ele: any): void {
        if ((this.selectedStreet1 != 'Ulica' && this.selectedStreet1 != '') && (this.selectedTown != 'Miasto' && this.selectedTown != '')) {
            ele.classList.remove("is-filled");
            ele.classList.add("is-opened");
            //inputStreetele.value = "";
        }
    }
    showDDTown(ele: any, inputStreetele: any): void {
        this.selectedTown = "Miasto";
        this.selectedStreet1 = "Ulica";
        this.selectedStreet = "Wybierz swój kod pocztowy";
        this.streetValues1 = [];
        if (inputStreetele.value != "") {
            inputStreetele.value = "";
        }
        ele.classList.remove("is-filled");
        ele.classList.add("is-opened");
    }
    hideDropDownStreet1(ele: any, event, sel): void {
        this.selectedStreet1 = sel;
        /*for (let i = 0; i < this.streetValues.length; i++) {
            if(this.streetValues[i].split('|').indexOf(this.selectedStreet1) !== -1) {
                this.selectedStreet = this.streetValues[i].split('|').join(',');                        
                break;
            }           
        }*/
        ele.classList.remove("is-opened");
        ele.classList.add("is-filled");
        event.stopPropagation();
    }
    hideDropDownStreet(ele: any, event, sel): void {
        this.selectedStreet = sel;
        this.streetEvent = event;
        ele.classList.remove("is-opened");
        ele.classList.add("is-filled");
        event.stopPropagation();
    }
    hideDropDownClickOutside(ele: any, event): void {
        ele.classList.remove("is-opened");
        ele.classList.add("is-filled");
        event.stopPropagation();

    }
    acceptCharSpace(event) {
        this.selectedStreet1 = "Ulica";
        this.selectedStreet = "Wybierz swój kod pocztowy";
        let k = event.charCode;
        let val = false;
        if ((k > 64 && k < 91) || (k > 96 && k < 123)) {
            return;
        } else {
            return val;
        }
    }
    getTownData(event) {
        let val = event.target.value;
        if (val.length == 3 && this.townNameMatched == '') {
            this.townNameMatched = val;
        }
        if (val.length < this.townNameMatched.length) {
            this.townNameMatched = '';
        }
        if (val.length >= 2) {
            this.cislService.getDataFromCislTownData(val).subscribe(data => this.serializeTown(data, val, event));
        }
        if (val.length < 2) {
            this.townValues = [];
            this.townValuesArray = [];
        }
    }
    getStreet1Data(event) {
        let streetParameter;
        if (event.target.value.length == 1 && this.streetNameMatched == '') {
            this.streetNameMatched = event.target.value;
        }
        if (event.target.value.length < this.streetNameMatched.length) {
            this.streetNameMatched = '';
        }
        for (let i = 0; i < this.townValues.length; i++) {
            if (this.selectedTown === this.townValues[i]) {
                streetParameter = this.townValuesArray[i];
                break;
            }
        }
        streetParameter = streetParameter + "|" + event.target.value;
        this.cislService.getDataFromCislStreetData(streetParameter).subscribe(data => this.serializeStreet(data, event.target.value, event));
    }
    onKeyStreetData(event) {
        let typedVal = event.target.value;
        let k = event.keyCode;
        let newArray = [];
        var p = 0;
        var toShowFull = 0;
        if (typedVal != '') {
            for (var i = 0; i < this.streetValues.length; i++) {
                if (typedVal.length <= this.streetValues[i].length) {
                    //if(this.streetValues[i].substring(0,typedVal.length).toUpperCase() == typedVal.toUpperCase()) {
                    if (this.streetValues[i].toUpperCase().indexOf(typedVal.toUpperCase()) !== -1) {
                        newArray[p++] = this.streetValues[i];
                    }
                }
            }
            if (k == 13) {
                if (p == 1) {
                    this.hideDropDownStreet(this.dropDownStreet.nativeElement, this.streetEvent, newArray[0]);
                }
            }
            this.showStreet = newArray;
        } else {
            this.showStreet = this.streetValues;
        }
    }

    /*Start for zipcode Help me find out*/

    /*Get First Registration Date */
    firstRegistrationDate(date: any): void {
        this.dateFirstRegistration = date;

        this.firstRegDate = this.dateFirstRegistration;
        this.getCarOwnYears();
        this.isMandatoryValidation();
        this.showSaveButton = true;
        this._saveButtonShowHide.showSaveButton();

        /* ********************DO-NOT-TOUCH-YEAR-OF-FIRSTREGISTRATION***************************************** */

        /* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
        AEMSet('digitalData.quote.quoteData.yearOfFirstRegistration', this.firstRegDate);
       

        /* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

        /* ************************DO-NOT-TOUCH****************************************** */

    }



    getFirstRegistrationYears() {
        this.years = [];
        for (var i = this.yy; i >= this.minYear; i--) {
            this.years.push(String(i));
        }

    }

    getCarOwnYears() {
        this.carOwnYears = [];
        for (var i = this.yy; i >= parseInt(this.dateFirstRegistration); i--) {
            this.carOwnYears.push(i);
        }
    }

    setCarOwnedDate(date: any): void {
        this.carOwnedDate = date;
        this.carOwnedFromDate = this.carOwnedDate;
        this.isMandatoryValidation();

        /* ********************DO-NOT-TOUCH-CAR_OWN_DATE***************************************** */

        /* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
        AEMSet('digitalData.quote.quoteData.yearofCarOwnership', this.carOwnedDate);
      
        /* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

        /* ************************DO-NOT-TOUCH****************************************** */

    }

    /* Start Current Mileage */
    acceptOnlyNumbers(event) {
        let k = event.charCode;
        let val = false;
        if ((k >= 48 && k <= 57) || (k == 0)) {
            return
        }
        else {
            return val;
        }
    }
    removeSpace(event) {
        let val = event.target.value;
        this.mileageValue = event.target.value;
        event.target.value = this.mileageValue.replace(/\s/g, '');
        this.currentMileage = event.target.value;
        this.currentMileageInput.nativeElement.setSelectionRange(val.length, val.length);
    }

    addSpace(event) {
        this.mileageValue = event.target.value;
        event.target.value = this.mileageValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        this.currentMileage = event.target.value;
    }


    saveData() {
        let data = {
            'licence': this.plateNo,
            'firstRegistration': this.dateFirstRegistration,
            'carImported': this.carImportedInMonths,
            'countryRegistration': this.selectedCountryRegistration,
            'countryCode': this.countryRegistrationMap[this.selectedCountryRegistration],
            'carOwnedDate': this.carOwnedDate,
            'purpose': this.selectedWhatPurpose,
            'purposeValue': this.carPurposeMap[this.selectedWhatPurpose],
            'parking': this.parkingDuringNights,
            'parkingValues': this.parkingDuringNightsMap[this.parkingDuringNights],
            'zipCode': this.zipCode,
            'abroad': this.carUsedAbroad,
            'abroadValue': this.carAbroadValuesMap[this.carUsedAbroad],
            'mileage': this.currentMileage,
            'plannedMilage': this.selectedPlanedMileage,
            'plannedMilageValue': this.PlannedYearlyMileageMap[this.selectedPlanedMileage],
            'contractId': this.contractId,
            'propertyId': this.propertyId,
            'isNextDisable': this.isNextDisable,
            'validateZipValue': this.validateZipValue,
            'consentsArr': this.consentsArr,
            'selectedAllConsent': this.selectedAllConsent,
            'questionCatelogueId': this.questionCatelogueId
        }

        sessionStorage.setItem('carusage', JSON.stringify(data));
        if (this.applicationData.propertyId == null || this.applicationData.propertyId == undefined || this.applicationData.propertyId == '') {
            this.applicationData.propertyId = this.propertyId;
            this.applicationData.showSaveButton = this.showSaveButton;
            this.applicationData.currentPageId = this.saveQuoteService.currentPageId;
            sessionStorage.setItem('Application', JSON.stringify(this.applicationData));
        }


    }
    trackcarusageabroad(data) {
        /* ********************DO-NOT-TOUCH-CAR-USAGE-ABROAD***************************************** */
              /* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
        AEMSet('digitalData.quote.quoteData.carAbroadUsage', data);
     
        /* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

        /* ************************DO-NOT-TOUCH****************************************** */

    }

    trackparkingnight(data) {
        /* ************************DO-NOT-TOUCH****************************************** */
        /* ********************DO-NOT-TOUCH-Place-OF-PARKING***************************************** */
       
        /* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
        AEMSet('digitalData.quote.quoteData.carParking', data);
     

        /* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

        /* ************************DO-NOT-TOUCH****************************************** */

    }

    trackCurrentMileage(data) {

        /* ********************DO-NOT-TOUCH-CAR-CURRENT-MIEALAGE***************************************** */
               /* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
        AEMSet('digitalData.quote.quoteData.carCurrentMileage', data);
     
        /* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */
    }
    clickBackButton() {
        //this.saveData();
        this.saveQuoteService.autoSavePageData();
        this.router.navigateByUrl('/cardetails');
    }
    clickNextButton() {
        this.nextClicked = true;
        let isvalid = this.isMandatoryValidation();
        if (!isvalid) {
            this.hasErrors = true;
            this.disabledNext = false;
        } else {
            if (this.propertyId == '' || !this.propertyId) {
                this.disabledNext = true;
                this.getPropertyId();
            } else {
                this.disabledNext = true;
                this.saveAndRouteToNext();
            }
        }
    }
    saveAndRouteToNext() {
        //this.saveData();
        this.saveQuoteService.autoSavePageData();
        this.sendMarketingConsentToCisl();
        this.router.navigateByUrl('/carownerdetails');
    }
    getStoredData() {
        let data = JSON.parse(sessionStorage.getItem('carusage'));
        this.applicationData = JSON.parse(sessionStorage.getItem('Application'));
        this.contractId = this.applicationData.contractId;
        if (data != null && data != undefined) {
            if (data.consentsArr.length > 0) {
                //this.getMarketingConsentsFromCisl();
                this.consentsArr = data.consentsArr;
                this.selectedAllConsent = data.selectedAllConsent;
                this.questionCatelogueId = data.questionCatelogueId;
            }
        } else {
            this.getMarketingConsentsFromCisl();
        }
        let carDetailsData = JSON.parse(sessionStorage.getItem('carDetails'));
        this.productionYear = carDetailsData.prodYear;
        if (parseInt(this.productionYear) < (this.yy - 30)) {
            this.minYear = (this.yy - 30);
        }
        else {
            this.minYear = parseInt(this.productionYear);
        }
        if (data !== null) {
            this.sessionStoredData = data;
            this.plateNo = data.licence;
            this.dateFirstRegistration = data.firstRegistration;
            this.firstRegDate = data.firstRegistration;
            this.carImportedInMonths = data.carImported;
            this.selectedCountryRegistration = data.countryRegistration;
            this.carOwnedDate = data.carOwnedDate;
            this.selectedWhatPurpose = data.purpose;
            this.purposeValue = data.purposeValue;
            this.parkingDuringNights = data.parking;
            this.parkingDuringNightsValues = data.parkingValues;
            this.zipCode = data.zipCode;
            this.carUsedAbroad = data.abroad;
            this.carUsedAbroadValue = data.abroadValue;
            this.currentMileage = data.mileage;
            this.selectedPlanedMileage = data.plannedMilage;
            this.plannedYearlyMileageValue = data.plannedMilageValue;
            this.propertyId = this.applicationData.propertyId;
            this.isNextDisable = data.isNextDisable;
            this.validateZipValue = data.validateZipValue;
            this.questionCatelogueId = data.questionCatelogueId;
            if (data.carOwnedDate !== '') {
                this.carOwnedFromDate = data.carOwnedDate;
            }

            if (data.firstRegistration !== null) {
                this.firstRegDate = String(data.firstRegistration);
            }
            if (this.carImportedInMonths == 'no') {
                this.carImported = false;
                this.selectedCountryRegistration = null
            } else if (this.carImportedInMonths == 'yes') {
                this.carImported = true;
            }
            this.isMandatoryValidation();
        }

    }

    firstRegiAcceptOnlyNumbers(event) {
        let k = event.charCode;
        let val = false;
        if ((k >= 48 && k <= 57) || (k != 8)) {
            return
        } else {
            return val;
        }
    }
    sinceOwnCarAcceptOnlyNumbers(event) {
        let k = event.charCode;
        let val = false;
        if ((k >= 48 && k <= 57) || (k != 8)) {
            return
        } else {
            return val;
        }
    }

    omit_specialChar(event) {
        var k;
        var val = false;
        k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 0 || k == 32 || k == 44 || k >= 128);
    }
    /* Marketing consents */
    getMarketingConsentsFromCisl() {
        this.cislService.getMarketingConsentsFromCisl(this.contractId, this.consentsId).subscribe(data => { this.serializeMarketingConsents(data) });
    }
    serializeMarketingConsents(data) {
        this.questionCatelogueId = data[0].questionsCatalogueId;
        this.consentsArr = data[0].decisionQuestion;
    }
    serializePutMarketingConsents(dat) { }
    setConsents(data) {
        this.isMarketingConsentChecked = !(data.IsConsentValid);
        this.selectedAllConsent = data.SelectedAllConsents;
        this.consentsArr = data.ConsentArray;
    }
    sendMarketingConsentToCisl() {
        if (this.questionCatelogueId !== '' && this.questionCatelogueId !== undefined) {
            this.cislService.sendMarketingConsentsToCisl(this.contractId, this.questionCatelogueId, this.consentsArr).subscribe(data => { this.serializePutMarketingConsents(data) });
        }
    }

}
