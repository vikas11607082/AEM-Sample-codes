import { Component, ElementRef, Renderer, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CislService } from '../util/util.cisl.service';
import { AuthOTPLoginService } from '../util/auth.otplogin.service';

@Component({
    templateUrl: './login.component.html'
})


export class LoginComponent implements OnInit {

    public pessel: string;
    public otp: string;
    public isOkClicked: boolean;
    public buttonLabel: string;

    public peselEmail: string;
    public policyNumberVar: string;
    public OTPText: string;
    public phoneNumber: string;
    public returnUrl: string;
    public reqParams: any;

    txtEmail: string;
    txtOTP: string;
    isPolicyId: boolean;
    txtPolicyId: string = "";

    public sessionStoredData: any;
    public isMultiplePolicy: boolean = false;
    public isSinglePolicy: boolean = true;
    public isOkDisabled: boolean = false;
    public policyType: string;

    ngOnInit() {
        sessionStorage.clear();
        this.isOkClicked = false;
        this.isPolicyId = false;
        this.buttonLabel = "OK";
        this.returnUrl = window.location.href;
        this.reqParams = this.readUrlParameter(this.returnUrl);
        this.reqParams = this.reqParams.policyRef ? this.reqParams.policyRef : this.reqParams.offerRef;
        // this.reqParams=atob(this.reqParams);
        if (this.reqParams == undefined) {
            this.reqParams = null;
        } else {
            this.isPolicyId = false;
            this.txtPolicyId = this.reqParams;
            this.isMultiplePolicy = true;
            this.isSinglePolicy = false;
        }
    }
    constructor(private router: Router, private cislService: CislService, private logService: AuthOTPLoginService) { }
    public setPessel(pessel: string) {
        this.pessel = pessel;
    }
    ngDoCheck() {
        if (this.txtEmail == '') {
            this.txtPolicyId = null;
            this.isPolicyId = false;
        }
    }
    removePolicyField() {
        this.txtPolicyId = null;
        this.txtOTP = null;
        this.isPolicyId = false;
        this.isOkClicked = false;
    }


    readUrlParameter(returnUrlPayment): Object {
        let Rurl = decodeURIComponent(returnUrlPayment);
        if (Rurl.indexOf("?") > 0) {
            let arrParam = Rurl.split("?");
            let readParam = arrParam[1].split("=");
            if (readParam[0] == "policyRef") {
                let obj = { "policyRef": '' };
                for (let i = 0; i < arrParam.length; i++) {
                    let sParam = arrParam[i].split(/=(.+)/);
                    obj[sParam[0]] = sParam[1];
                }
                this.policyType = "P";
                return obj;
            }
            else {
                let obj = { "offerRef": '' };
                for (let i = 0; i < arrParam.length; i++) {
                    let sParam = arrParam[i].split(/=(.+)/);
                    obj[sParam[0]] = sParam[1];
                }
                this.policyType = "O";
                return obj;

            }
        }
    }


    public setOtp(otp: string) {
        this.otp = otp;
    }
    //validate policy id 
    btnEnableMultiPolicy() {
        this.isOkDisabled = false;
    }


    //validate Email and pesel
    btnEnable() {
        this.isOkDisabled = false;
        this.txtOTP = null;
        this.isOkClicked = false;
    }
    //run on button click and check email
    removeSpace() {
        this.txtEmail = this.txtEmail.replace(/\s/gi, "");
    }
    isOkCheckEmail() {
        this.buttonLabel = "Login";
        if (!this.isPolicyId) {
            let reqParam = {
                "login": this.txtEmail,
                "policyType": this.policyType
            };
            this.cislService.postGenerateOTP(reqParam).subscribe(data => this.serializeEmail(data), error => this.errorHandler(error));
        }
        if (this.txtPolicyId !== "" && this.txtPolicyId != null) {
            let reqParam = {
                "login": this.txtEmail,
                "policyNumber": this.txtPolicyId,
                "policyType": this.policyType
            };
            this.cislService.postGenerateOTP(reqParam).subscribe(data => this.serializePolicyId(data), error => this.errorHandlerMultiPolicy(error));
        }
        else {
            console.log("Please enter policy number");
        }

    }

    isOkCheckEmailMulti() {
        this.buttonLabel = "Login";
        this.txtPolicyId = this.reqParams;
        if (this.txtPolicyId !== "") {
            let reqParam = {
                "login": this.txtEmail,
                "policyNumber": this.txtPolicyId,
                "policyType": this.policyType
            };
            this.cislService.postGenerateOTP(reqParam).subscribe(data => this.serializePolicyId(data), error => this.errorHandlerMultiple(error));
        }
    }
    //if email has multiple policyid
    errorHandler(error) {
        let _error = JSON.parse(error._body);
        if (_error.errorCode == "TOO_MANY_PARTNERS") {

            if (this.reqParams != null && this.reqParams != '') {
                this.isPolicyId = false;

            } else {
                this.isPolicyId = true;
                this.isOkClicked = false;
            }
        }
        if (_error.errorCode == "PARTNER_NOT_FOUND") {
            this.isOkDisabled = true;
        }

    }
    errorHandlerMultiPolicy(error) {
        let _error = JSON.parse(error._body);
        if (_error.errorCode == "PARTNER_NOT_FOUND") {
            this.isOkDisabled = true;
        }
    }
    errorHandlerMultiple(error) {
        let _error = JSON.parse(error._body);
        if (_error.errorCode == "PARTNER_NOT_FOUND") {
            this.isOkDisabled = true;
        }
    }
    //if email has single policy
    serializeEmail(data) {
        this.isOkClicked = true;
        let emailDetails = data;
        if (emailDetails != null && emailDetails.login != '') {
            this.peselEmail = emailDetails.login;
            this.phoneNumber = emailDetails.phoneNumber;
            this.policyNumberVar = emailDetails.policyNumber;
        }
        else {
            this.router.navigate(['/login']);
        }
    }

    // to handle multiple policy 
    serializePolicyId(data) {
        this.isOkClicked = true;
        let policyDetails = data;
        if (policyDetails.policyNumber != '' && policyDetails.policyNumber != null && policyDetails.login == this.txtEmail
            && policyDetails.policyNumber == this.txtPolicyId) {
            this.peselEmail = policyDetails.login;
            this.policyNumberVar = policyDetails.policyNumber;
            this.phoneNumber = policyDetails.phoneNumber;
        } else {
            this.router.navigate(['/login']);
        }
    }

    isLoginClicked() {
        if (this.buttonLabel == "Login") {
            if (this.txtPolicyId == '') {
                let reqParam = {
                    "login": this.txtEmail,
                    "token": this.txtOTP
                };
                this.cislService.postValidateOTP(reqParam).subscribe(data => this.serializeOTP(data));
            } else {
                let reqParamPolicy = {
                    "login": this.txtEmail,
                    "policyNumber": this.txtPolicyId,
                    "token": this.txtOTP
                };
                this.cislService.postValidateOTP(reqParamPolicy).subscribe(data => this.serializeOTPWithPolicy(data));
            }
        }
    }


    serializeOTP(data) {
        let otpDetails = data;
        if (otpDetails.login == this.txtEmail) {
            this.logService.setUserLogin(true);
            let docType = this.policyType;
            sessionStorage.setItem("documentType", JSON.stringify(docType));
            this.router.navigate(['/policydetails']);
        }
        else {
            this.router.navigate(['/login']);
        }
    }

    serializeOTPWithPolicy(data) {
        let otpWithPolicy = data;
        if (otpWithPolicy.login == this.txtEmail && otpWithPolicy.policyNumber == this.txtPolicyId) {
            this.logService.setUserLogin(true);
            let docType = this.policyType;
            sessionStorage.setItem("documentType", JSON.stringify(docType));
            this.router.navigate(['/policydetails']);
        }
        else {
            this.router.navigate(['/login']);
        }
    }

    /* scenario Second */
    setLoginOtpData() {
        let _data = { "policyId": this.reqParams }//this.reqParams.policyRef
        sessionStorage.setItem("loginOtpData", JSON.stringify(_data));
    }

    /*public isLoginClicked() {
        this.isOkClicked = false;
        if (this.buttonLabel == "Login") {
            let reqParam = {
                "login": this.txtEmail,
                "token": this.txtOTP
            };
            this.cislService.postValidateOTP(reqParam).subscribe(data => this.serializeOTP(data), error => this.errorHandlerIsPolicy(error));
        }
    }

    errorHandlerIsPolicy(error) {
        let _error = JSON.parse(error._body);
        if (_error.errorCode == "TOO_MANY_PARTNERS") {
            let reqParam = {
                "login": this.txtEmail,
                "policyNumber": this.txtPolicyId,
                "token": this.txtOTP
            };
            this.cislService.postGenerateOTP(reqParam).subscribe(data => this.serializePolicyId(data));
        }
        else {
            this.router.navigate(['/login']);
        }
    }*/


}