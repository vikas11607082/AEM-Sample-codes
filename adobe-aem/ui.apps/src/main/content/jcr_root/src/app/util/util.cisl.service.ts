import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, UrlTree } from '@angular/router';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { CustomUrlSerializer } from '../commons/customurl/customUrlSerializer';
import { API_BASE_URL } from '../commons/services/apibaseurl.config';

@Injectable()
export class CislService {

	private headers = new HttpHeaders().set('Content-Type', 'application/json');
	private finalUrl = '';
	private responseData = '';
	private cislUrlTree: UrlTree;


	//Domain Services
	private cislUrlCarDetails = '/domain/vehicledetails';
	private cislUrlDatalist = '/domain/datalist?datalistType=';
	private cislUrlVehicleCharacteristics = '/domain/vehiclecharacteristics?';
	private cislUrlZipCode = '/domain/zipcodes?filterRegEx=';
	private cislUrTown = '/domain/towns?filterRegEx=';
	private cislUrlStreet = '/domain/streets?filterRegEx=';


	//Policy Services
	private cislProductOffers = '/policy/offerings?';
	private cislPolicyCoverages = '/policy/policies?';
	private cislSelectPolicy = '/policy/businessacceptance/processtransition/selectpolicy/';
	private cislGetBundlePremium = '/policy/contracts/contractId/policies/policyId/premium';
	private cislPolicyCoverageDetails = '/policy/contracts/contractId/policies/policyId/policyandpremium';
	private cislPolicyPremium = '/policy/contracts/contractId/policies/policyId/premium';
	private cislIssuePolicy = '/policy/businessacceptance/processtransition/issuepolicy/policyId';
	private cislPaymentData = '/policy/contracts/contractId/policies/policyId/paymentdata';
	private cislGetIssuedPolicyPremium = '/policy/contracts/contractId/issuedpolicypremium';

	//Customer and Contract Services
	private cislSaveOwner = '/customer/contractId/party';
	private cislUpdateOwner = '/customer/contractId/updateparty/partyId';
	private cislDeleteOwner = '/customer/contractId/deleteParty/partyId';
	private cislContractId = '/customer/contracts';
	private cislPropertyId = '/customer/contractId/properties';
	private cislAssignDriverRole = '/customer/contractId/parties/partyId/partyroles';
	private cislPostDriverDetails = '/customer/contracts/contractId/propertyId/driverdetails';
	private cislDeleteDriverRole = '/customer/contractId/parties/partyId/partyroles/partyRoleId';
	private cislPostContactDetails = '/customer/contracts/contractId/parties/contactchannels';
	private cislPostContactDetailsPH = '/customer/contracts/contractId/parties/contactchannels';
	private cislUpdateContact = '/customer/contracts/contractId/parties/updatecontactchannels';
	private cislUpdateLicencePlate = '/customer/contractId/updateproperty/propertyId';
	private cislPostPolicyHolderAddr = '/customer/contracts/contractId/parties/sendaddress';
	private cislPostIdDocs = '/customer/contracts/contractId/parties/partyId/identificationdocuments';
	private cislPutIdDocs = '/customer/contracts/contractId/parties/partyId/identificationdocuments/identificationDocumentId';
	private cislDeleteIdDocs = '/customer/contracts/contractId/parties/partyId/identificationdocuments/identificationDocumentId';
	private cislGetProperty = '/customer/contractId/property/propertyId';
	private cislUpdateContactDetailsPH = '/customer/contracts/contractId/parties/updatecontactchannels';
	private cislUpdatePHRole = '/customer/contractId/parties/partyId/partyroles/partyRoleId';
	private cislCarInspection = '/customer/contracts/contractId/serviceprovider/carinspection';

	//Consents Services
	private cislGetMarketingConsents = '/consent/contracts/contractId/consents?consentIds=';
	private cislSendMarketingConsents = '/consent/contracts/contractId/questionscatalogues/questionsCatalogueId/questions';

	//Authentication Services
	private cislGenerateOTP = '/authenticate/generateotp';
	private cislValidateOTP = '/authenticate/validateotp';
	private authenticateUserUrl = '/authenticate/validateuser';

	//Document Services
	private sendEmailUrl = '/document/contracts/contractId/policies/policyId/email';
	private cislPostPolicyDocument = '/document/contracts/contractId/policies/policyId/policyDoc?documentType=';
	private cislGetDocPolicyHolderPolicyNum = '/document/search/policyholder?policyNumber=';
	private cislGetInsuredProperties = '/document/search/insuredproperties?policyNumber=';
	private cislGetDocPoliciesNum = '/document/search/policies?policyNumber=';

	//System services
	private cislSystemPing = '/system/ping';
	private cislCallCenterSearch = '/contactcenter/searchquote?';
	private cislCallCenterRetrieve = '/contactcenter/retrieveccquote?';

	// Configuration Services
	private cislGetUpSellOffer = '/policy/contracts/contractId/policies/policyId/upselloffer';
	private cislGetInstallmentType = '/policy/contracts/contractId/policies/policyId/installmenttype';
	private cislGetPaymentType = '/policy/contracts/contractId/policies/policyId/paymenttype';
	private cislPutConfigurationData = '/policy/contracts/contractId/policies/policyId';

	// Quote Store services
	private saveQuoteId = "/quotestore/createQuote";
    private saveQuote = "/quotestore/save";
	private retrieveQuote = "/quotestore/retrievequote";
	private retrieveQuoteEmailValidate = "/quotestore/validatelink";
	private retrieveQuoteValidateAnswers = "/quotestore/validateanswer";


	constructor(private http: HttpClient, private customUrl: CustomUrlSerializer, private router: Router, @Optional() @Inject(API_BASE_URL) private apiBaseUrl: string) { }

	private url(path: string) {
		return this.apiBaseUrl ? this.apiBaseUrl + path : path;
	}
	getDataFromCislCarDetails(requestParams: any): any {
		this.finalUrl = '';
		if (requestParams != '') {
			this.finalUrl = this.cislUrlCarDetails + '?' + requestParams;
		}
		return this.http.get(this.finalUrl == '' ? this.customUrl.serialize(this.url(this.cislUrlCarDetails)) : this.customUrl.serialize(this.url(this.finalUrl)));
	}
	getDataFromCislDatalistType(requestParams: any): any {
		console.log("CISL Car usage : " + this.cislUrlDatalist + requestParams);
		return this.http.get(this.customUrl.serialize(this.url(this.cislUrlDatalist + requestParams)));
	}
	getDataFromCislVehicleCharacteristics(requestParams: any) {
		return this.http.get(this.customUrl.serialize(this.url(this.cislUrlVehicleCharacteristics + requestParams)));
	}
	getDataFromCislZipCodeData(requestParams: any): any {
		console.log("CISL Car usage : " + this.cislUrlZipCode + requestParams);
		return this.http.get(this.customUrl.serialize(this.url(this.cislUrlZipCode + requestParams)));
	}
	getDataFromCislTownData(requestParams: any): any {
		console.log("CISL Car usage : " + this.cislUrTown + requestParams);
		return this.http.get(this.customUrl.serialize(this.url(this.cislUrTown + requestParams)));
	}
	getDataFromCislStreetData(requestParams: any): any {
		return this.http.get(this.customUrl.serialize(this.url(this.cislUrlStreet + requestParams)));
	}
	getProductOffers(params: any): any {
		let requestParams = "contractId=" + params.contractId + "&quoteId=" + params.quoteId + "&"+"email=" + params.email;
		return this.http.get(this.customUrl.serialize(this.url(this.cislProductOffers + requestParams)));
	}
	getPolicyCovrages(requestParams: any): any {
		return this.http.get(this.customUrl.serialize(this.url(this.cislPolicyCoverages + requestParams)));
	}


	saveOwnerDetails(request: any, contractId) {
		var cislSaveOwner = JSON.parse(JSON.stringify(this.cislSaveOwner));
		cislSaveOwner = cislSaveOwner.replace('contractId', contractId);
		return this.http.post(this.customUrl.serialize(this.url(cislSaveOwner)), request, { headers: this.headers });
	}

	updateOwnerDetails(request: any, contractId, partyId) {
		var cislUpdateOwner = JSON.parse(JSON.stringify(this.cislUpdateOwner));
		cislUpdateOwner = cislUpdateOwner.replace('contractId', contractId);
		cislUpdateOwner = cislUpdateOwner.replace('partyId', partyId);
		return this.http.put(this.customUrl.serialize(this.url(cislUpdateOwner)), request, { headers: this.headers });
	}

	deleteOwnerDetails(contractId, partyId) {
		var cislDeleteOwner = JSON.parse(JSON.stringify(this.cislDeleteOwner));
		cislDeleteOwner = cislDeleteOwner.replace('contractId', contractId);
		cislDeleteOwner = cislDeleteOwner.replace('partyId', partyId);
		return this.http.delete(this.customUrl.serialize(this.url(cislDeleteOwner)), { headers: this.headers });
	}

	getContractIdFromCisl() {
		return this.http.post(this.customUrl.serialize(this.url(this.cislContractId)), { headers: this.headers });
	}

	getPropertyIdFromCisl(params) {
		var cislPropertyId = JSON.parse(JSON.stringify(this.cislPropertyId));
		cislPropertyId = cislPropertyId.replace('contractId', params.contractId);
		return this.http.post(this.customUrl.serialize(this.url(cislPropertyId)), { "licensePlateNumber": params.licensePlateNumber }, { headers: this.headers });
	}


	getDriverRoleIdForOwnerFromCisl(contractId, partyId) {
		var cislAssignDriverRole = JSON.parse(JSON.stringify(this.cislAssignDriverRole));
		cislAssignDriverRole = cislAssignDriverRole.replace('contractId', contractId);
		cislAssignDriverRole = cislAssignDriverRole.replace('partyId', partyId);
		return this.http.post(this.customUrl.serialize(this.url(cislAssignDriverRole)), { "roleName": "D" }, { headers: this.headers });
	}
	getPolicyHolderRoleIdFromCisl(contractId, partyId) {
		var cislAssignDriverRole = JSON.parse(JSON.stringify(this.cislAssignDriverRole));
		cislAssignDriverRole = cislAssignDriverRole.replace('contractId', contractId);
		cislAssignDriverRole = cislAssignDriverRole.replace('partyId', partyId);
		return this.http.post(this.customUrl.serialize(this.url(cislAssignDriverRole)), { "roleName": "PH" }, { headers: this.headers });
	}
	getBundlePremiumFromCisl(contractId, policyId) {
		var cislGetBundlePremium = JSON.parse(JSON.stringify(this.cislGetBundlePremium));
		cislGetBundlePremium = cislGetBundlePremium.replace('contractId', contractId);
		cislGetBundlePremium = cislGetBundlePremium.replace('policyId', contractId);
		return this.http.get(this.customUrl.serialize(this.url(cislGetBundlePremium)), );
	}

	postDriverDetails(params, contractId, propertyId) {
		var cislPostDriverDetails = JSON.parse(JSON.stringify(this.cislPostDriverDetails));
		cislPostDriverDetails = cislPostDriverDetails.replace('contractId', contractId);
		cislPostDriverDetails = cislPostDriverDetails.replace('propertyId', propertyId);
		return this.http.put(this.customUrl.serialize(this.url(cislPostDriverDetails)), params, { headers: this.headers });
	}
	deleteDriverRole(contractId, partyId, roleId) {
		var cislDeleteDriverRole = JSON.parse(JSON.stringify(this.cislDeleteDriverRole));
		cislDeleteDriverRole = cislDeleteDriverRole.replace('contractId', contractId);
		cislDeleteDriverRole = cislDeleteDriverRole.replace('partyId', partyId);
		cislDeleteDriverRole = cislDeleteDriverRole.replace('partyRoleId', roleId);
		return this.http.delete(this.customUrl.serialize(this.url(cislDeleteDriverRole)), { headers: this.headers });
	}
	postSelectPolicy(policyId) {
		var cislSelectPolicy = this.cislSelectPolicy + policyId;
		return this.http.post(this.customUrl.serialize(this.url(cislSelectPolicy)), { headers: this.headers });
	}
	postContactDetails(contractId, params) {
		var cislPostContactDetails = JSON.parse(JSON.stringify(this.cislPostContactDetails));
		cislPostContactDetails = cislPostContactDetails.replace('contractId', contractId);
		return this.http.post(this.customUrl.serialize(this.url(cislPostContactDetails)), params, { headers: this.headers });
	}
	updateContact(contractId, params) {
		var cislUpdateContact = JSON.parse(JSON.stringify(this.cislUpdateContact));
		cislUpdateContact = cislUpdateContact.replace('contractId', contractId);
		return this.http.put(this.customUrl.serialize(this.url(cislUpdateContact)), params, { headers: this.headers });
	}


	postorUpdateContactDetails(req, contractId, httpMethod) {
		if (httpMethod == 'post') {
			var cislContactDetails = JSON.parse(JSON.stringify(this.cislPostContactDetailsPH));
		} else {
			var cislContactDetails = JSON.parse(JSON.stringify(this.cislUpdateContactDetailsPH));
		}
		cislContactDetails = cislContactDetails.replace('contractId', contractId);
		return this.http[httpMethod](this.customUrl.serialize(this.url(cislContactDetails)), req, { headers: this.headers });
	}
	postPolicyHolerAddress(contractId, requestParams, httpMethod) {
		var cislPostPolicyHolderAddr = JSON.parse(JSON.stringify(this.cislPostPolicyHolderAddr));
		cislPostPolicyHolderAddr = cislPostPolicyHolderAddr.replace('contractId', contractId);
		if (httpMethod == 'put') {
			cislPostPolicyHolderAddr = cislPostPolicyHolderAddr.replace('sendaddress', 'updateaddress');
			return this.http[httpMethod](this.customUrl.serialize(this.url(cislPostPolicyHolderAddr)), requestParams, { headers: this.headers });
		}
		return this.http[httpMethod](this.customUrl.serialize(this.url(cislPostPolicyHolderAddr)), requestParams, { headers: this.headers });
	}
	getDataFromCislPolicyCoverage(contractId, policyId): any {
		var cislPolicyCoverageDetails = JSON.parse(JSON.stringify(this.cislPolicyCoverageDetails));
		cislPolicyCoverageDetails = cislPolicyCoverageDetails.replace('contractId', contractId);
		cislPolicyCoverageDetails = cislPolicyCoverageDetails.replace('policyId', policyId);
		return this.http.get(this.customUrl.serialize(this.url(cislPolicyCoverageDetails)));
	}
	getDataFromCislPolicyPremium(requestParams: any, contractId, policyId): any {
		var cislPolicyPremium = JSON.parse(JSON.stringify(this.cislPolicyPremium));
		cislPolicyPremium = cislPolicyPremium.replace('contractId', contractId);
		cislPolicyPremium = cislPolicyPremium.replace('policyId', policyId);
		return this.http.get(this.customUrl.serialize(this.url(cislPolicyPremium)));
	}
	updateProperty(contractId, propertyId, params) {
		var cislUpdateLicencePlate = JSON.parse(JSON.stringify(this.cislUpdateLicencePlate));
		cislUpdateLicencePlate = cislUpdateLicencePlate.replace('contractId', contractId);
		cislUpdateLicencePlate = cislUpdateLicencePlate.replace('propertyId', propertyId);
		return this.http.put(this.customUrl.serialize(this.url(cislUpdateLicencePlate)), params, { headers: this.headers });
	}
	postIdentificationNumber(contractId, partyId, params) {
		var cislPostIdDocs = JSON.parse(JSON.stringify(this.cislPostIdDocs));
		cislPostIdDocs = cislPostIdDocs.replace('contractId', contractId);
		cislPostIdDocs = cislPostIdDocs.replace('partyId', partyId);
		return this.http.post(this.customUrl.serialize(this.url(cislPostIdDocs)), params, { headers: this.headers });
	}
	putIdentificationNumber(contractId, partyId, identificationDocumentId, params) {
		var cislPutIdDocs = JSON.parse(JSON.stringify(this.cislPutIdDocs));
		cislPutIdDocs = cislPutIdDocs.replace('contractId', contractId);
		cislPutIdDocs = cislPutIdDocs.replace('partyId', partyId);
		cislPutIdDocs = cislPutIdDocs.replace('identificationDocumentId', identificationDocumentId);
		return this.http.put(this.customUrl.serialize(this.url(cislPutIdDocs)), params, { headers: this.headers });
	}
	deleteIdentificationNumber(contractId, partyId, identificationDocumentId) {
		var cislDeleteIdDocs = JSON.parse(JSON.stringify(this.cislDeleteIdDocs));
		cislDeleteIdDocs = cislDeleteIdDocs.replace('contractId', contractId);
		cislDeleteIdDocs = cislDeleteIdDocs.replace('partyId', partyId);
		cislDeleteIdDocs = cislDeleteIdDocs.replace('identificationDocumentId', identificationDocumentId);
		return this.http.delete(this.customUrl.serialize(this.url(cislDeleteIdDocs)), { headers: this.headers });
	}
	postIssuePolicy(policyId) {
		var cislIssuePolicy = JSON.parse(JSON.stringify(this.cislIssuePolicy));
		cislIssuePolicy = cislIssuePolicy.replace('policyId', policyId);
		return this.http.post(this.customUrl.serialize(this.url(cislIssuePolicy)), { headers: this.headers });
	}
	getPropertyDetails(contractId, propertyId) {
		var cislGetProperty = JSON.parse(JSON.stringify(this.cislGetProperty));
		cislGetProperty = cislGetProperty.replace('contractId', contractId);
		cislGetProperty = cislGetProperty.replace('propertyId', propertyId);
		return this.http.get(this.customUrl.serialize(this.url(cislGetProperty)));
	}
	updatePH(contractId, partyId, roleId) {
		var cislUpdatePHRole = JSON.parse(JSON.stringify(this.cislUpdatePHRole));
		cislUpdatePHRole = cislUpdatePHRole.replace('contractId', contractId);
		cislUpdatePHRole = cislUpdatePHRole.replace('partyId', partyId);
		cislUpdatePHRole = cislUpdatePHRole.replace('partyRoleId', roleId);
		return this.http.put(this.customUrl.serialize(this.url(cislUpdatePHRole)), { "roleName": "PH" }, { headers: this.headers });
	}

	sendEmail(contractId, policyId) {
		var sendEmailUrl = JSON.parse(JSON.stringify(this.sendEmailUrl));
		sendEmailUrl = sendEmailUrl.replace('contractId', contractId);
		sendEmailUrl = sendEmailUrl.replace('policyId', policyId);
		return this.http.post(this.customUrl.serialize(this.url(sendEmailUrl)), { headers: this.headers });
	}

	//get paymentdata pass two parameter ..sho``
	getPaymentServices(contractId, policyId) {
		var cislPaymentData = JSON.parse(JSON.stringify(this.cislPaymentData));
		cislPaymentData = cislPaymentData.replace('contractId', contractId);
		cislPaymentData = cislPaymentData.replace('policyId', policyId);
		return this.http.get(this.customUrl.serialize(this.url(cislPaymentData)), { headers: this.headers });
	}
	getCarInspectionDetails(contractId) {
		var cislCarInspection = JSON.parse(JSON.stringify(this.cislCarInspection));
		cislCarInspection = cislCarInspection.replace('contractId', contractId);
		return this.http.get(this.customUrl.serialize(this.url(cislCarInspection)), { headers: this.headers });
	}
	getMarketingConsentsFromCisl(contractId, consentId) {
		var cislGetMarketingConsents = JSON.parse(JSON.stringify(this.cislGetMarketingConsents));
		cislGetMarketingConsents = cislGetMarketingConsents.replace('contractId', contractId);
		cislGetMarketingConsents = cislGetMarketingConsents + consentId;
		return this.http.get(this.customUrl.serialize(this.url(cislGetMarketingConsents)), );
	}
	sendMarketingConsentsToCisl(contractId, questionCatelogueId, params) {
		var cislSendMarketingConsents = JSON.parse(JSON.stringify(this.cislSendMarketingConsents));
		cislSendMarketingConsents = cislSendMarketingConsents.replace('contractId', contractId);
		cislSendMarketingConsents = cislSendMarketingConsents.replace('questionsCatalogueId', questionCatelogueId);
		return this.http.put(this.customUrl.serialize(this.url(cislSendMarketingConsents)), params, { headers: this.headers });
	}
	authenticateUser(params) {
		var authenticateUserUrl = JSON.parse(JSON.stringify(this.authenticateUserUrl));
		return this.http.post(this.customUrl.serialize(this.url(authenticateUserUrl)), params, { headers: this.headers });
	}

	postGenerateOTP(params) {
		return this.http.post(this.customUrl.serialize(this.url(this.cislGenerateOTP)), params, { headers: this.headers });
	}
	postValidateOTP(params) {
		return this.http.post(this.customUrl.serialize(this.url(this.cislValidateOTP)), params, { headers: this.headers });
	}
	getDataFromDocumentPolicyNumber(requestParams: any): any {
		console.log("CISL Policydetails policy number : " + this.cislGetDocPolicyHolderPolicyNum + requestParams);
		return this.http.get(this.customUrl.serialize(this.url(this.cislGetDocPolicyHolderPolicyNum + requestParams)));
	}

	getDataFromDocumentInsuredProperties(requestParams: any): any {
		console.log("CISL Policydetails policy number : " + this.cislGetInsuredProperties + requestParams);
		return this.http.get(this.customUrl.serialize(this.url(this.cislGetInsuredProperties + requestParams)));
	}
	postDocumentData(contractId, policyId, docType) {
		var cislPostPolicyDocument = JSON.parse(JSON.stringify(this.cislPostPolicyDocument));
		cislPostPolicyDocument = cislPostPolicyDocument.replace("contractId", contractId);
		cislPostPolicyDocument = cislPostPolicyDocument.replace("policyId", policyId);
		cislPostPolicyDocument = cislPostPolicyDocument + docType;
		return this.http.post(this.customUrl.serialize(this.url(cislPostPolicyDocument)), { responseType: 'arraybuffer' }, { headers: this.headers });
	}

	getIssuedPolicyPremium(contractId): any {
		var cislGetIssuedPolicyPremium = JSON.parse(JSON.stringify(this.cislGetIssuedPolicyPremium));
		cislGetIssuedPolicyPremium = cislGetIssuedPolicyPremium.replace('contractId', contractId);
		return this.http.get(this.customUrl.serialize(this.url(cislGetIssuedPolicyPremium)));
	}

	getSystemPingInfo(): any {
		var cislSystemPing = JSON.parse(JSON.stringify(this.cislSystemPing));
		return this.http.get(this.customUrl.serialize(this.url(cislSystemPing)));
	}
	getDataForCallCenterSearch(quoteId: any, email: any) {
		var cislCallCenterSearch = JSON.parse(JSON.stringify(this.cislCallCenterSearch));
		cislCallCenterSearch = cislCallCenterSearch + 'quoteId=' + quoteId + '&email=' + email;
		console.log("url " + cislCallCenterSearch);
		return this.http.get(this.customUrl.serialize(this.url(cislCallCenterSearch)), { headers: this.headers });
	}
	getDataForCallCenterRetrieve(quoteId: any, email: any) {
		var cislCallCenterRetrieve = JSON.parse(JSON.stringify(this.cislCallCenterRetrieve));
		cislCallCenterRetrieve = cislCallCenterRetrieve + 'quoteId=' + quoteId + '&email=' + email;
		console.log("url " + cislCallCenterRetrieve);
		return this.http.get(this.customUrl.serialize(this.url(cislCallCenterRetrieve)), { headers: this.headers });
	}

	getUpSellOfferConfiguration(contractId, policyId) {
		var cislGetUpSellOffer = JSON.parse(JSON.stringify(this.cislGetUpSellOffer));
		cislGetUpSellOffer = cislGetUpSellOffer.replace('contractId', contractId);
		cislGetUpSellOffer = cislGetUpSellOffer.replace('policyId', policyId);
		return this.http.get(this.customUrl.serialize(this.url(cislGetUpSellOffer)), { headers: this.headers });
	}

	getPaymentServicesInstallmentType(contractId, policyId) {
		var cislGetInstallmentType = JSON.parse(JSON.stringify(this.cislGetInstallmentType));
		cislGetInstallmentType = cislGetInstallmentType.replace('contractId', contractId);
		cislGetInstallmentType = cislGetInstallmentType.replace('policyId', policyId);
		return this.http.get(this.customUrl.serialize(this.url(cislGetInstallmentType)), { headers: this.headers });
	}
	getPaymentServicesPaymentType(contractId, policyId) {
		var cislGetPaymentType = JSON.parse(JSON.stringify(this.cislGetPaymentType));
		cislGetPaymentType = cislGetPaymentType.replace('contractId', contractId);
		cislGetPaymentType = cislGetPaymentType.replace('policyId', policyId);
		return this.http.get(this.customUrl.serialize(this.url(cislGetPaymentType)), { headers: this.headers });
	}
	updateConfigurationDetails(request: any, contractId, policyId) {
		var cislPutConfigurationData = JSON.parse(JSON.stringify(this.cislPutConfigurationData));
		cislPutConfigurationData = cislPutConfigurationData.replace('contractId', contractId);
		cislPutConfigurationData = cislPutConfigurationData.replace('policyId', policyId);
		return this.http.put(this.customUrl.serialize(this.url(cislPutConfigurationData)), request, { headers: this.headers });
	}

	getAuthData(ticketId:any) {		
		return this.http.get(this.customUrl.serialize(this.url('/ccautheaders?ticket='+ticketId)), { headers: this.headers });//.map(data => { return data;});
	}
	checkLoggedIn(ticketId:any) {
		return this.http.get(this.customUrl.serialize(this.url('/ccloggedin?ticket='+ticketId)), { headers: this.headers });//.map(data => { return data;});
	}

	/* Save and Retrieve API service calls */
	public getQuoteId() {
        return this.http.post(this.customUrl.serialize(this.url(this.saveQuoteId)),{headers: this.headers});
    }

    public saveQuotation(params){
        return this.http.post(this.customUrl.serialize(this.url(this.saveQuote)),params,{headers: this.headers});
	}
	
	public validateQuoteRetrieveEmail(params){
		return this.http.post(this.customUrl.serialize(this.url(this.retrieveQuoteEmailValidate)),params,{headers: this.headers})
	}

    public validateSecurityQuestions(params){
        // TO do API call for validation of sceurity questions.
        return this.http.post(this.customUrl.serialize(this.url(this.retrieveQuoteValidateAnswers)),params,{headers: this.headers});
        
    }

    public retrieveQuoteData(params){
        this.retrieveQuote += "?quoteId=" + params.quoteId + "&email=" + params.email;
        return this.http.get(this.customUrl.serialize(this.url(this.retrieveQuote)),{headers: this.headers});
    }
	/* Save and Retrieve API service calls ends */
	public logout(){
		return this.http.get(this.customUrl.serialize(this.url("/cclogout")),{headers: this.headers});
	}

}
