import { Component, Renderer, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CustomUrlSerializer } from '../../commons/customurl/customUrlSerializer';
import { CislService } from '../../util/util.cisl.service';
import { ErrorPopUp } from '../../commons/popup/popup.component';
import { CallPopUp } from '../../commons/popup/callcenterpopup.component';
import { AEMSet, AEMTrack ,AEMClearVars} from '../../commons/analytics';
import { SaveQuoteService } from '../../savequote/quote.save.service';
import { SaveButtonHideShowService } from '../../savequote/save.button.hide.show.service';


declare var window: any;
@Component({
    entryComponents: [ErrorPopUp, CallPopUp],
    templateUrl: '../html/quote.thankyou.component.html'
})


export class ThankYouComponent {


    /*code added for progress bar starts*/
    @ViewChild('progressbarActive') progressbarActive: ElementRef
    @ViewChild('dropDownCarBrand') dropDownCarBrand: ElementRef
    @ViewChild('dropDownProdYear') dropDownProdYear: ElementRef


    public onlinePaymentFlag: boolean = true;
    public onlinePaymentSuccessfulFlag: boolean = false;
    public onlinePaymentUnsuccessfulFlag: boolean = false;
    public onlinePaymentPendingFlag: boolean = false;
    public onlinePaymentCancelFlag: boolean = false;


    public showBackendError: boolean = false;
    public showCallCenterError: boolean = false;
    public showAppointInspe: boolean;

    public summaryData: any;
    public policyPrice: string = null;

    public contractId: string = null;
    public policyId: string = null;
    public requestParam = null;
    public paymentToThank: boolean;
    public summaryToThank: boolean;
    public returnUrl: string;

    public contractParam: string;
    public paymentstatus: string;
    public reqParams: any;

    private thankYouSessionData: any;
    private currentPageId = 9;
    private paymentURL: string = "";

    public configDataFromSession: any;
    public isPaymentatBank: boolean = false;
    public policyNumber: string = null;
    public accountNumberofBank: string = null;
    public sessionBankAccount: any;

    /*code added for progress bar ends*/
    constructor(private renderer: Renderer, private cislService: CislService,
        private router: Router, private saveQuoteService: SaveQuoteService, private _saveButtonShowHide: SaveButtonHideShowService) { }


    ngOnInit() {

        /*code to get current pageName and pageID and send it to adobe analytics*/

        var path = window.location.href;
        var pageData = path.split("#/");
        var currentPageName = pageData[1];



        if (currentPageName == "thankyou") {
            var pageName = "Thank you";
            var pageID = "car/S9confirmation:Step9";

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

        this.getContractId();
        this.getPolicyId();
        this.getThankYouData();
        if (this.policyId != null && this.policyId != '' && this.contractId != '' && this.contractId != null) {
            this.getPaymentURL();
        }
        if (this.contractId != null) {
            this.getCarInspectionData();
        }

        //start for policy price display from configuration
        let policyPriceFromConfigData = JSON.parse(sessionStorage.getItem("configData"));
        if (policyPriceFromConfigData.installmentType.value == "ANNUAL") {
            this.policyPrice = policyPriceFromConfigData.premiumAmount;
        } else {
            this.policyPrice = policyPriceFromConfigData.totalAmount2;
        }
        //end for policy price display from configuration

        // for payment at bank start
        this.summaryData = JSON.parse(sessionStorage.getItem("SummaryData"));
        if (this.summaryData != null && this.summaryData != '') {
            this.policyNumber = this.summaryData.policyNumber;
            if (this.summaryData.isNextFlag == false || this.summaryData.isNextFlag == true) {
                let obj = {
                    "isNextFlag": true,
                }
                sessionStorage.setItem("thankyou", JSON.stringify(obj));
            }
        }
        this.configDataFromSession = JSON.parse(sessionStorage.getItem("configData"));
        if (this.configDataFromSession != null && this.configDataFromSession != '') {
            if (this.configDataFromSession.paymentType.value == "BANK_TRANSFER") {
                this.isPaymentatBank = true;
                this.onlinePaymentFlag = false;
                if (this.configDataFromSession.installmentType.value == "ANNUAL") {
                    this.policyPrice = this.configDataFromSession.premiumAmount;
                } else {
                    this.policyPrice = this.configDataFromSession.totalAmount2;
                }
            }
        }
        //for payment at bank end


        /* Save Quote Listener function*/
        this._saveButtonShowHide.showQuoteId();
        this._saveButtonShowHide.hideSaveButton();
        this.addSaveQuoteListener();

    }


    private addSaveQuoteListener(): void {
        this.saveQuoteService.currentPageId = this.currentPageId;
        this.saveQuoteService.SaveQuote.subscribe(() => {
            this.saveToSession();
        });
    }


    getThankYouData() {
        this.returnUrl = window.location.href;
        this.reqParams = this.readUrlParameter(this.returnUrl);
        this.thankYouSessionData = JSON.parse(sessionStorage.getItem("Thankyou"));
        if (this.thankYouSessionData) {
            this.paymentToThank = this.thankYouSessionData.isPayment;
            let appointInspe = this.thankYouSessionData.isAppointInspe;
            if (this.paymentToThank == true) {
                this.onlinePaymentFlag = false;
                this.paymentStatus(this.reqParams);
            }
            if (appointInspe == true) {
                this.showAppointInspe = true;
            }
        } else {
            if (this.reqParams) {
                this.cislService.getIssuedPolicyPremium(this.reqParams.contractId).subscribe(data => this.serializePolicyPremium(data));
            }
        }
    }

    serializePolicyPremium(data) {
        this.assignPolicyPremium(data.policyPremium);
        this.onlinePaymentFlag = false;
        this.paymentStatus(this.reqParams);
    }

    assignPolicyPremium(data) {
        let model = data;
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

        this.policyPrice = totalAmt;
    }

    readUrlParameter(returnUrlPayment): Object {
        let Rurl = returnUrlPayment;
        if (Rurl.indexOf("?") > 0) {
            let arrParam = Rurl.split("?");
            let urlParam = arrParam[1].split("&");

            let obj = { "contractId": '', "paymentStatus": '' };

            for (let i = 0; i < urlParam.length; i++) {
                let sParam = urlParam[i].split("=");
                obj[sParam[0]] = sParam[1];
            }
            return obj;
        }
    }

    paymentStatus(arrReqParams) {
        if (arrReqParams.paymentStatus == "SUCCESSFUL") {
            this.onlinePaymentSuccessfulFlag = true;
            this.saveQuoteService.autoSavePageData();
        }
        if (arrReqParams.paymentStatus == "PENDING") {
            this.onlinePaymentPendingFlag = true;
        }
        if (arrReqParams.paymentStatus == "FAILED" || arrReqParams.paymentStatus == "CANCELLED") {
            this.onlinePaymentUnsuccessfulFlag = true;
        }
    }
    getContractId() {
        if (JSON.parse(sessionStorage.getItem('Application')) !== null) {
            this.contractId = JSON.parse(sessionStorage.getItem('Application')).contractId;
            return this.contractId
        } else {
            return this.contractId;
        }
    }
    getPolicyId() {
        if (JSON.parse(sessionStorage.getItem('productBundleData')) !== null) {
            this.policyId = JSON.parse(sessionStorage.getItem('productBundleData')).policyId;
            return this.policyId
        } else {
            return this.policyId;
        }
    }

    serializeAppoinmentData(data) {
        let appData = data;
        if (appData.providerType == 'PHYSICAL') {
            this.showAppointInspe = true;
        }
        else {
            this.showAppointInspe = false;
        }

    }

    serializeCarPaymentData(data) {
        let paymentData = data;
        if (paymentData.extEntity) {
            let entity = paymentData.extEntity;
            this.paymentURL = entity.paymentServiceUrl;
            this.saveQuoteService.autoSavePageData();
        } else if (paymentData.accountNumber) {
            this.accountNumberofBank = paymentData.accountNumber;
            this.saveBankAccountNumber(this.accountNumberofBank);
            this.saveQuoteService.autoSavePageData();
        } else {
            let bankDetailsformSession = JSON.parse(sessionStorage.getItem('bankAccountDetails'));
            this.accountNumberofBank = bankDetailsformSession.bankAccountNumber;
            this.saveQuoteService.autoSavePageData();
        }
    }

    saveBankAccountNumber(bankData) {
        let bankDetails = {
            "bankAccountNumber": bankData
        }
        sessionStorage.setItem("bankAccountDetails", JSON.stringify(bankDetails));
    }
    saveToSession() {
        let thankYouData = {
            "isPayment": this.paymentToThank,
            "isAppointInspe": this.showAppointInspe,
            "paymentSuccessFul": this.onlinePaymentSuccessfulFlag,
            "paymentURL": this.paymentURL,
            "policyNumber": this.policyNumber
        };
        sessionStorage.setItem("Thankyou", JSON.stringify(thankYouData));
    }

    getPaymentURL() {
        this.cislService.getPaymentServices(this.contractId, this.policyId).subscribe(data => this.serializeCarPaymentData(data));
    }

    getPaymentServiceData() {
        this.paymentToThank = true;
        this.saveToSession();
        window.location.href = this.paymentURL;

    }
    getCarInspectionData() {
        this.cislService.getCarInspectionDetails(this.contractId).subscribe(data => this.serializeAppoinmentData(data));
    }

    tryAgainForPayment() {
        this.paymentToThank = true;
        this.saveToSession();
        this.cislService.getPaymentServices(this.contractId, this.policyId).subscribe(data => this.serializeCarPaymentData(data));
    }
}