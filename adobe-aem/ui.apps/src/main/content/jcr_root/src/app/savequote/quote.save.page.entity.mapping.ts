import {Injectable} from '@angular/core';
import {PolicyHolderSessionMapService} from './policyholder.save.session.map.service';

@Injectable()
export class SaveQuotePageToEntityMappingService{
    constructor(private policyHolderSessionService :PolicyHolderSessionMapService){}
    private currentPageId:Number=0;
    private currency = "zł";

    private setVehicleData(sessionData):object{
        let carDetailsData = sessionData.carDetails;
        let carUsageData = sessionData.carusage;        
        let driverDetailsData = sessionData.driverData ? sessionData.driverData:{'driverKidBirthYear':'Wybierz'};
        let firstRegistration = carUsageData.firstRegistration == "Wybierz"? "":carUsageData.firstRegistration;
        let purchaseDate = carUsageData.carOwnedDate == "Wybierz"? "":carUsageData.carOwnedDate;
        let vehicle = {
            "licensePlateExists": false,
            "licensePlateNumber": carUsageData.licence,
            "usage":  carUsageData.purposeValue,
            "distance":  carUsageData.mileage.replace(/\s/g, ''),
            "rightHandedDrive": carDetailsData.sideofwheel == "Right"? true : false,
            "recentImport": carUsageData.carImported == "yes"? true :false,
            "garageLocation": carUsageData.zipCode,
            "vehicleBrand": carDetailsData.carBrand,
            "vehicleModel": carDetailsData.carModel,
            "buildYear": carDetailsData.prodYear,
            "firstRegistrationDate": firstRegistration,
            "expertCatalogIdentificationNumber": carDetailsData.carVersionId,
            "purchaseDate":purchaseDate ,
            "countryCode": carUsageData.countryCode == undefined ? "" : carUsageData.countryCode,
            "power": carDetailsData.carEnginePower == "Wybierz" ? "" : carDetailsData.carEnginePower,
            "cubicCapacity": carDetailsData.carEngineSize == "Wybierz" ? "" : carDetailsData.carEngineSize,
            "modelDetail": carDetailsData.carVersionName,
            "fuelType": carDetailsData.fuelType,
            "bodyType": carDetailsData.carBody,
            "numberOfDoors": carDetailsData.carVersionDoors,
            "antiTheftDevice": carDetailsData.antiTheftValues.toString().substring(1),
            "placeOfParking": carUsageData.parkingValues,
            "yearlyMilageAbroad": carUsageData.abroadValue,
            "yearlyMilage": carUsageData.plannedMilageValue,
            "vehicleIdentificationNumber": "",
            "majorExistingDamages": false,
            "existingDamageDescription": "",
            "numberOfKeys": 1,
            "youngDriver": driverDetailsData.driverHasKids ? driverDetailsData.driverHasKids : false,
            "youngDriverBirthYear": driverDetailsData.driverKidBirthYear == "Wybierz" ? "" : driverDetailsData.driverKidBirthYear,   
        };
        return vehicle;
    }

    private setQuoteData(sessionData):object{      
        let quoteData:any = {
            "quoteId":sessionData.quoteId,
            "quoteStatus":"QUOTATION",
            "email":sessionData.owner?sessionData.owner.email:'',
            "phoneNumber":sessionData.owner?sessionData.owner.phone:'',
            "savedPageNo": this.currentPageId,
            "phoneConsentAccepted":sessionData.phoneConsentAccepted,
            "emailConsentAccpeted":sessionData.emailConsentAccepted       
        };
        return quoteData;
    }

    private setPartyData(sessionData):any{
        let partyData = [];
        for(let i=0; i<sessionData.length; i++){
            if(sessionData[i].type !== ""){
                let obj = this.mapPartyData(sessionData[i], i);
                partyData.push(obj);
            }
            
        }
        
        return partyData;
    }

    private mapPartyData(party,i){
        let mainOwner = i == 0 ? true : false;
        let partyOwnerType = "";
        if( i == 0){
            partyOwnerType = "mo";
        } else if(i == 1){
            partyOwnerType = "co1";
        } else if(i == 2){
            partyOwnerType = "co2";
        }
        let partyData = {
            "firstName": party.firstName,
            "lastName": party.surName,
            "maidenName": party.familyName,
            "peselId": party.peselId,
            "typeOfOwnerShip": party.type == "PrivatePerson" ? "PP" : "",
            "roleName": "PO",
            "companyName": "",
            "regon": party.type == "SoleTrader" ? party.regOn : "",
            "mainOwner": mainOwner,
            "partyOwnerType":partyOwnerType
          };
          if(party.type == "SoleTrader") {
            partyData.typeOfOwnerShip = "ST"
          }
      
          if(party.type == "Company") {
            partyData.companyName = party.companyName;
            partyData.regon = party.companyRegOn;
          }
          if(party.type == "Bank") {
            partyData.companyName = party.bankName;
            partyData.regon = party.bankRegOn;
            partyData.roleName = "BANK";
          }
          if(party.type == "Leasing") {
            partyData.companyName = party.leaseName;
            partyData.regon = party.leaseRegOn;
            partyData.roleName = "LEASING";
          }

          return partyData;
    }

    private createDriverOtherParty(party, type){
        let partyData = {
            "firstName": party.driverFirstname,
            "lastName": party.driverSurName,
            "maidenName": party.driverFamilyName,
            "peselId": party.driverPesel,
            "typeOfOwnerShip":"PP",
            "roleName": "D",
            "companyName": "",
            "regon": party.driverRegon,
            "mainOwner": type == "mo" ? true : false,
            "partyOwnerType":type
          };
          partyData['driver'] = this.createDriverObject(party);
          partyData['identificationDocument'] = this.createIdentificationDocumentObject(party); 
          return partyData;
    }

    private setDriverDataOnParty(entityObj, driverSession){
        let partyObj = entityObj.party;
        for(let i = 0; i < partyObj.length; i++){
            if(partyObj[i].peselId == driverSession.driverPesel){
                partyObj[i].roleName = "D";
                partyObj[i]['driver'] = this.createDriverObject(driverSession);
                partyObj[i]['identificationDocument'] = this.createIdentificationDocumentObject(driverSession); 
            }
        }

        return partyObj;
    }

    private createDriverObject(driverSession){
        let issueData = "";
        let driverMarried = driverSession.driverMarried !== undefined? driverSession.driverMarried : "";
        let driverMarriedStatus = String(driverSession.driverMarried) == "true" ? "M" : "S";
        if((driverSession.policyStartYear == "Year" || driverSession.policyStartYear == "YYYY") ||
            (driverSession.policyStartMonth == "Month" || driverSession.policyStartYear == "MM") ||
            (driverSession.policyStartMonth == "Date" || driverSession.policyStartYear == "DD")){
                issueData = null;
            } else {
                issueData = driverSession.policyStartYear + "-" + driverSession.policyStartMonth + "-" + driverSession.policyStartDate
            }
         return {
            "issueDate":issueData,
            "maritalStatus": driverMarried == "" ? "" : driverMarriedStatus
        };
    }

    private createIdentificationDocumentObject(driverSession){
        let licenceDate = driverSession.driverLicenceDate == "Wybierz"? "" : driverSession.driverLicenceDate;
        return {
           "licenseIssueYear":licenceDate          
       };
   }

   private saveThankYouData(obj, thankyouData){
       if(thankyouData.paymentSuccessFul){           
        obj.quote.quoteStatus = "POLICY";                
       } else {
        obj.quote.quoteStatus = "OFFER"; 
       }
       obj.quote.paymentUrl = thankyouData.paymentURL;
       obj.quote.carInspection = thankyouData.isAppointInspe ? "Y" : "N";

       return obj;
   }

   private getOwnerType(type){
       let ownerType = "";
       switch (type) {
           case "mainOwner":
               ownerType = "mo";
               break;
           case "coOwner":
               ownerType = "co1";
               break;
           case "coOwner2":
               ownerType = "co2";
               break;
           case "other":
               ownerType = "ot";
       }

       return ownerType;
   }


    public getEntityDataToSave(sessionData, currentPageId, isBuyNow):object{        
        let obj = {'vehicle':{},'quote':{}};
        this.currentPageId = currentPageId;
        obj.vehicle = this.setVehicleData(sessionData);
        obj.quote = this.setQuoteData(sessionData.Application);
        if(sessionData.ownerData){
            obj['party'] = this.setPartyData(sessionData.ownerData.ownerDetails)
        }

        if(sessionData.driverData){
            let ownerType = this.getOwnerType(sessionData.driverData.driver);            
                obj['party'].push(this.createDriverOtherParty(sessionData.driverData, ownerType ));          
                     
        }
        if(sessionData.productBundleData){
            obj.quote['bundleJson'] = JSON.stringify(sessionData.productBundleData.productData);
            obj.quote['selectedBundleType'] = sessionData.productBundleData.selectedBundleId;
            obj.quote['offer'] = sessionData.productBundleData.productData;
        }

        if(sessionData.phData){
           obj = this.policyHolderSessionService.policHolderSessionSaveMap(sessionData.phData, obj);
        }

        if(currentPageId >=6){
            let premium = sessionData.configData.premiumAmount.split(this.currency);
            premium = premium[0].replace(/\s/g, '');
            premium = premium.replace(',','.');           
            obj.quote['selectedPremiumAmount'] = premium;
            obj.quote['bundleConfigJson'] = JSON.stringify(sessionData.configData.configData);
            obj.quote['installmentType'] = sessionData.configData.installmentType.value;
            obj.quote['paymentType'] = sessionData.configData.paymentType.value;
            obj.quote['config'] = sessionData.configData.configData;
        }

        if(currentPageId >= 8 && isBuyNow){
            obj.quote['quoteStatus'] = "OFFER";
            obj.quote['policyNumber'] = sessionData.SummaryData.policyNumber;
        }

        if(currentPageId == 9){
            obj = this.saveThankYouData(obj, sessionData.Thankyou);
        }
       
        return obj;
    }


    }

