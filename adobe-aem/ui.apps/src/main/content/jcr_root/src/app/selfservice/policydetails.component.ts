import { Component, ElementRef, Renderer, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CislService } from '../util/util.cisl.service';
import { Router } from '@angular/router';
import { UrlSerializer } from '@angular/router';
import { CustomUrlSerializer } from '../commons/customurl/customUrlSerializer';
import { ErrorPopUp } from '../commons/popup/popup.component';
import { CallPopUp } from '../commons/popup/callcenterpopup.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Headers } from "@angular/http/src/headers";
import { saveAs } from 'file-saver/FileSaver';
import { AEMSet, AEMTrack } from '../commons/analytics';

@Component({
  templateUrl: './policydetails.component.html',
  entryComponents: [ErrorPopUp, CallPopUp]
})


export class PolicydetailsComponent {

  constructor(private _fb: FormBuilder, private cislService: CislService, private router: Router) { }


  public policyNum = [];
  public insuredProperties = [];
  public nameSurname: String;
  public vehicleDetails: string;
  public contractId: string = 'dummy'; //TODO : Replace contract id
  //public policyId: string = '80045105'; //TODO : Replace policy id from session storage Login OTP page
  public domSanitizer: any;
  public sessionStoredData: any;
  public policyId: String = '';
  public OTPData: any;
  public selectedMyAccount: any;
  public docType: any;
  public policyType: boolean;
  public offerType: boolean;
  ngOnInit() {
    this.OTPData = JSON.parse(sessionStorage.getItem("loginOtpData"));
    this.docType = JSON.parse(sessionStorage.getItem("documentType"));
    if (this.docType == "P") {
      this.policyType = true;
      this.offerType = false;
    }
    if (this.docType == "O") {
      this.policyType = false;
      this.offerType = true;
    }
    this.getLoginOtpData();

    var path = window.location.href;
    var pageData=path.split("#/");
    var currentPageName=pageData[1];
   

   if (currentPageName=="policydetails")
    {
	 var pageName= "Policy Details";
   //var pageID="car/S1carDetails:Step1";

	 		/* ********************DO-NOT-TOUCH***************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.spapageview', pageName);
               AEMTrack('spapageview');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */

     } //end if condition



  }
  getPolicyDetailsData() {
    this.cislService.getDataFromDocumentPolicyNumber(this.policyId).subscribe(data => this.serializePolicyNumber(data));
    this.cislService.getDataFromDocumentInsuredProperties(this.policyId).subscribe(data => this.serializeInsuredProperties(data));
  }

  getLoginOtpData() {
    if (this.OTPData !== null) {
      this.policyId = this.OTPData.policyId;
    }
    this.getPolicyDetailsData();
  }

  serializePolicyNumber(data: any) {
    let policyHolderData = data;
    this.nameSurname = policyHolderData[0].firstName;
    this.policyNum.push(this.nameSurname);
  }

  serializeInsuredProperties(data: any) {
    let model = data;
    console.log(model);
    let vehicleData = model[0].characteristics;
    this.vehicleDetails = vehicleData.vehicleBrand + " " + vehicleData.vehicleModel;
    this.insuredProperties.push(vehicleData.vehicleDetails);
  }

  serializePolicyDocument(data: any) {
    if (this.docType == "P") {
      let fileName = "polisa.pdf"
      let arrayBufferData = this._base64ToArrayBuffer(data);
      let file = new Blob([arrayBufferData], { type: 'application/pdf' });
      saveAs(file, fileName);

          	/* ********************DO-NOT-TOUCH***************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.quoteData.downloadPolicyDocument', fileName);
               AEMTrack('downloadPolicyDoc');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */
    }
    else {
      let fileName = "oferta.pdf"
      let arrayBufferData = this._base64ToArrayBuffer(data);
      let file = new Blob([arrayBufferData], { type: 'application/pdf' });
      saveAs(file, fileName);
      
    }
  }

  _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64.data);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }


  downloadPolicyDetailsDoc() {
    this.cislService.postDocumentData(this.contractId, this.policyId, this.docType).subscribe(data => this.serializePolicyDocument(data));

  }

  expand(element): void {
    console.log("Inside expand on click event");
    element.classList.add('is-opened');
  }


  collapse(element): void {
    console.log("Inside collapse on click event");
    element.classList.remove('is-opened');
  }


}