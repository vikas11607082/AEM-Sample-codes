import { Injectable, Output, Input, EventEmitter } from '@angular/core';
import { PolicyHolderSessionRestoreService } from './policyholder.restore.session.service'

@Injectable()
export class RestoreQuoteSessionService {
    
    @Output() emitCCUserName: EventEmitter<any> = new EventEmitter<any>();
    constructor(private phSessionRestore : PolicyHolderSessionRestoreService) { }

    public restoreResData:any;
    public policyId:any;
    public isPremiumChanged:boolean = false;  
    public ccUserName:string = "";

    public setCCUserNameHeader(data) {
        this.ccUserName = data;
        this.emitCCUserName.emit(this.ccUserName);
    }
    public setPagesSessionData(data) {
        this.restoreResData = data;
        this.setApplicationSession(this.restoreResData.quote);
        this.setCarDetailsSession(this.restoreResData.vehicle);
        this.setCarUsageSession(this.restoreResData.vehicle);

        if(this.restoreResData.party){
            this.setCarOwnerSession(this.restoreResData.party);
            this.setDriverSession(this.restoreResData.party, this.restoreResData.vehicle);
        }        
        
        if(this.restoreResData.quote.offer){
            this.setProductBundleSession(this.restoreResData.quote);
        }

        if(this.restoreResData.quote.config || (this.restoreResData.quote.installmentType == "SEMI_ANNUAL" ||  this.restoreResData.quote.installmentType == "ANNUAL")){
            this.setConfigurationSession(this.restoreResData.quote);
        }

        this.setPolicyHolderSession();
        
        return this.restoreResData.quote.savedPageNo;
        

    }



    /* Restoring Application Session */
    private setApplicationSession(quoteData) {
        let applicationData: any = {
            "contractId": quoteData.contractId,
            "quoteId": quoteData.quoteId,
            "quoteStatus": "QUOTATION",
            "currentPageId": quoteData.savedPageNo,
            "showSaveButton": true,
            "propertyId": quoteData.propertyId,
            "phoneConsentAccepted":quoteData.phoneConsentAccepted,
            "emailConsentAccepted":quoteData.emailConsentAccpeted,
            'isFromRestore':true           
        }

        if(quoteData.email !== "" || applicationData.currentPageId >= 3){
            let obj = {
                "email":quoteData.email,
                "phone":quoteData.phoneNumber
            }
            applicationData['owner'] = obj;
        }

        sessionStorage.setItem("Application", JSON.stringify(applicationData));
    }

    /* Restoring Car Details page Session */
    private setCarDetailsSession(vehicle) {
        let carDetailsData: any = {
            "carBrand": vehicle.vehicleBrand,
            "prodYear": vehicle.buildYear,
            "fuelType": vehicle.fuelType,
            "carBody": vehicle.bodyType,
            "carModel": vehicle.vehicleModel,
            "carVersionId": vehicle.expertCatalogIdentificationNumber,
            "carVersionName": vehicle.modelDetail,
            "carVersionDoors": vehicle.numberOfDoors,
            "antiTheftOption": "",
            "antiTheftValues": "," + vehicle.antiTheftDevice,
            "otherAntiTheftDesc": "",
            "sideofwheel": vehicle.rightHandedDrive ? "Right" : "Left",
            "noneAntiTheft": vehicle.antiTheftDevice == "" ? true : false,
            "carEngineSize": vehicle.cubicCapacity,
            "carEnginePower": vehicle.power,
            "consentsArr": []
        };
        sessionStorage.setItem("carDetails", JSON.stringify(carDetailsData));

    }

    /* Restoring Car usage page Session */
    private setCarUsageSession(vehicle) {
        let carUsageData: any = {
            "licence": vehicle.licensePlateNumber,
            "firstRegistration": vehicle.firstRegistrationDate == "" ? "Wybierz" : vehicle.firstRegistrationDate,
            "carImported": vehicle.recentImport ? "yes" : "no",
            "countryRegistration": vehicle.countryCode !== "" ? vehicle.countryCode : "",
            "carOwnedDate": vehicle.purchaseDate == "" ? "Wybierz" : vehicle.purchaseDate,
            "purpose": "",
            "purposeValue": vehicle.usage,
            "parking": "",
            "parkingValues": vehicle.placeOfParking,
            "zipCode": vehicle.garageLocation,
            "abroad": "",
            "abroadValue": vehicle.yearlyMilageAbroad,
            "mileage": vehicle.distance !== undefined ? String(vehicle.distance): "",
            "plannedMilage": "",
            "plannedMilageValue": vehicle.yearlyMilage,            
            "isNextDisable": true,
            "validateZipValue": true,
            "consentsArr": []
        }
        sessionStorage.setItem("carusage", JSON.stringify(carUsageData));
    }

    /* Restoring Car owner page Session */
    private setCarOwnerSession(owners){
        let carOwnerData = {"ownerDetails":[]};
        let ownerDetails = [];
        for(let i=0; i<owners.length; i++){
            /* To Do : - Update condition when restoring policyholder data */
            if(owners[i].roleName !== "D" && !(owners[i].hasOwnProperty('mailingAddressSame')) ){
                let obj = this.mapPartyData(owners[i]);
                ownerDetails.push(obj);
            }            
        }
        carOwnerData.ownerDetails = ownerDetails;
        sessionStorage.setItem("ownerData", JSON.stringify(carOwnerData));
       
    }


    private mapPartyData(owner){
        let type = this.getOwnerType(owner);
        let ownerObj = {  
            "type":type,
            "firstName":owner.firstName,
            "surName":owner.lastName,
            "peselId":owner.peselId,
            "familyName":owner.maidenName,
            "regOn":owner.regon,
            "companyName":type == "Company" ? owner.companyName: "",
            "companyRegOn":type == "Company" ? owner.regon: "",
            "bankName":type == "Bank" ? owner.companyName: "",
            "bankRegOn":type == "Bank" ? owner.regon: "",
            "leaseName":type == "Leasing" ? owner.regon: "",
            "leaseRegOn":type == "Leasing" ? owner.regon: "",
            "partyId":owner.partyId,
            "roleId":owner.roleId
         }

         return ownerObj;
    }

    private getOwnerType(owner){
        let type = "";
        if(owner.typeOfOwnerShip == "PP"){
            type = "PrivatePerson";
        } else if(owner.typeOfOwnerShip == "ST"){
            type = "SoleTrader";
        } else if(owner.companyName !== "" && owner.roleName == "BANK"){
            type = "Bank";
        } else if(owner.companyName !== "" && owner.roleName == "LEASING"){
            type = "Leasing";
        } else if(owner.companyName !== "" && owner.roleName == "PO"){
            type = "Company";
        }

        return type;
    }

    /* Restoring Driver page Session */
    private setDriverSession(owners, vehicle){
        let driverSession = {
            "driver": "",
            "driverFirstname": "",
            "driverSurName": "", 
            "driverLicenceDate": "",
            "driverFamilyName": "",
            "driverPesel": "",
            "driverRegon": "", 
            "driverMarried": "", 
            "driverHasKids": false, 
            "driverKidBirthYear": "",             
            "consent": [], 
            "questionCatelogueId": "",
            "partyId": "", 
            "roleId": "",
            "emailChannelId": "",
            "phoneChannelId": "",
            "identificationDocumentId": "", 
            "isEmailPhoneDriverPage": false, 
            "driverOtherOptionSel": false
         };

        for(let i=0; i < owners.length; i++){
            if(owners[i].roleName == "D"){
               let driver = this.findDriver(owners[i].partyOwnerType);
               let party = owners[i];
               let driverMarried = this.findMaritalStatus(party.driver.maritalStatus);
               let policyStartDate = party.driver.issueDate !== undefined ? party.driver.issueDate.split('-'): null;
               let policyStartDay = policyStartDate !== null ? Number(policyStartDate[2]) : "Date";
               let policyStartMonth = policyStartDate !== null ? Number(policyStartDate[1]) : "Month";
               let policyStartYear = policyStartDate !== null ? Number(policyStartDate[0]) : "Year";
               driverSession.driver = driver;
               driverSession.driverFirstname = party.firstName;
               driverSession.driverSurName = party.lastName;
               driverSession.driverFamilyName = party.maidenName;
               driverSession.driverPesel = party.peselId;
               driverSession.driverRegon = party.regon;
               driverSession.driverMarried = driverMarried;
               driverSession.driverHasKids = vehicle.youngDriver;
               driverSession.driverKidBirthYear = vehicle.youngDriverBirthYear == "" ? "Wybierz" : vehicle.youngDriverBirthYear;
               driverSession['policyStartDate'] = policyStartDay;
               driverSession['policyStartMonth'] = policyStartMonth;
               driverSession['policyStartYear'] = policyStartYear;
               driverSession.driverOtherOptionSel = party.partyOwnerType == "ot" ? true : false;
               driverSession.driverLicenceDate = party.identificationDocument.licenseIssueYear == "" ? "Wybierz" : party.identificationDocument.licenseIssueYear;
               driverSession.partyId = party.driver.driverPartyId;
               driverSession.roleId = party.driver.driverRoleId;
               driverSession.identificationDocumentId = party.driver.identificationDocumentId;
                
               sessionStorage.setItem("driverData", JSON.stringify(driverSession));
            }
        }

        
    }

    private findMaritalStatus(status) {
        let marriedStatus = undefined;       
        
        switch (status) {
            case "M":
                marriedStatus = "true";
                break;

            case "S":
                marriedStatus = "false";
                break;

        }

        return marriedStatus;
    }


    private findDriver(ownerType) {
        let type = "";
        switch (ownerType) {
            case "mo":
                type = "mainOwner";
                break;

            case "co1":
                type = "coOwner";
                break;

            case "co2":
                type = "coOwner2";
                break;

            case "ot":
                type = "other";
                break;
        }

        return type;
    }

    /* Restoring Product Bundle session */
    private setProductBundleSession(quoteData){
        let bundleData = {
            //"productData": JSON.parse(quoteData.bundleJson)
            "productData": quoteData.offer       
        }

        if(quoteData.selectedBundleType !== ""){
            let obj = this.getBundleNamePolicyId(bundleData.productData, quoteData.selectedBundleType);
            bundleData['selectedBundleId'] = quoteData.selectedBundleType;
            bundleData['policyId'] = obj.policy;
            bundleData['selectedBundleName'] = obj.name;
            this.policyId = obj.policy;
            
        }
        sessionStorage.setItem("productBundleData", JSON.stringify(bundleData));
    }

    private getBundleNamePolicyId(bundleData, bundleId) {
        let obj = { "name": "", "policy": "", "id": "" };
        for (let i = 0; i < bundleData.offerings.length; i++) {
            let offerings = bundleData.offerings[i].offeringData;            
            if (offerings.bundleId == bundleId) {                
                obj.name = offerings.bundleName;
                obj.policy = offerings.policyId;
                obj.id = offerings.bundleId;
            }
        }

        return obj;
    }


    /* Restoring Configuration Page session */
    private setConfigurationSession(quoteData){
        let obj = {
            "installmentType" : {"value" : quoteData.installmentType},
            "paymentType" : {"value" : quoteData.paymentType},
            "configData" : quoteData.config,
            "premiumAmount" : quoteData.selectedPremiumAmount,
            "selectedPolicyId" : this.policyId
        };

        sessionStorage.setItem("configData", JSON.stringify(obj));
    }

    /* Restoring Policyholder page data */
    private setPolicyHolderSession(){
        let phData = this.phSessionRestore.policHolderSessionRestore(this.restoreResData);
        if(phData['policyHolderType']){
            sessionStorage.setItem("phData", JSON.stringify(phData));
        }
    }

}