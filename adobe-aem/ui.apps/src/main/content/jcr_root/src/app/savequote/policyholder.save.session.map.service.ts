import { Injectable } from '@angular/core';
@Injectable()
export class PolicyHolderSessionMapService {
    constructor() { }
    public quoteSaveObj: any;
    public phData: any;

    /* Policy holder session to save mapping */
    public policHolderSessionSaveMap(phData, saveObj) {
        this.quoteSaveObj = saveObj;
        this.phData = phData;
        this.assignContactValues();
        this.addPhDataToParty();
        this.addVehicleDetails();
        return this.quoteSaveObj;

    }

    /* Adding Vehicle details */
    private addVehicleDetails(){
        this.quoteSaveObj.vehicle.vehicleIdentificationNumber = this.phData.vin;//licensePlateNo
        this.quoteSaveObj.vehicle.licensePlateNumber = this.phData.licensePlateNo;
        this.quoteSaveObj.vehicle.licensePlateExists = !(this.phData.licensePlate);
        this.quoteSaveObj.vehicle.numberOfKeys = Number(this.phData.noOfKeys);        
        this.quoteSaveObj.vehicle.majorExistingDamages = this.phData.isCarDamaged == "damagedNo" ? false : true;
        this.quoteSaveObj.vehicle.existingDamageDescription = this.phData.damagedDesc;
    }

    /* Adding policyholder data to party */
    private addPhDataToParty() {       
        let parties =  JSON.parse(JSON.stringify(this.quoteSaveObj.party));
        let otherPhParty :any;
        for (let i = 0; i < parties.length; i++) {
            if (this.phData.policyHolderType == "mainOwner" && parties[i].partyOwnerType == "mo" && parties[i].roleName !== "D" ||
                this.phData.policyHolderType == "coOwner1" && parties[i].partyOwnerType == "co1" && parties[i].roleName !== "D" ||
                this.phData.policyHolderType == "coOwner2" && parties[i].partyOwnerType == "co2" && parties[i].roleName !== "D" ||
                this.phData.policyHolderType == "driver" && parties[i].roleName == "D") {
                parties[i].roleName = parties[i].roleName == "D" ? "DPH" : "PH";
                parties[i] = this.assignResAddressDataToPHParty(parties[i]);
                if (parties[i].mailingAddressSame == "N") {
                    parties[i] = this.assignMailAddressDataToParty(parties[i]);
                }
                this.quoteSaveObj.party.push(parties[i]);
            } else if (parties[i].partyOwnerType == "mo" && parties[i].roleName !== "D") {
                parties[i] = this.assignResAddMainOwnerParty(parties[i]);
                this.quoteSaveObj.party.push(parties[i]);
            } else if(parties[i].partyOwnerType == "co1" && parties[i].roleName !== "D"){
                parties[i] = this.assignResAddCoOwnerParty(parties[i]);
                this.quoteSaveObj.party.push(parties[i]);
            } else if(parties[i].partyOwnerType == "co2" && parties[i].roleName !== "D"){
                parties[i] = this.assignResAddCoOwner2Party(parties[i]);
                this.quoteSaveObj.party.push(parties[i]);
            }
            
        }

        /* Add other policy holder to Party object */
        if (this.phData.policyHolderType == "other") {
            otherPhParty = this.createPolicyHolderOtherParty();
            otherPhParty = this.assignResAddressDataToPHParty(otherPhParty);
            if (otherPhParty.mailingAddressSame == "N") {
                otherPhParty = this.assignMailAddressDataToParty(otherPhParty);
            }
        }
        if(otherPhParty){
            this.quoteSaveObj.party.push(otherPhParty);           
        }        
        
    }

    /* Assign Email and Phone values to quote */
    private assignContactValues() {
        this.quoteSaveObj.quote.phoneNumber = this.phData.selectedOwnerTypeContact[0].value;
        this.quoteSaveObj.quote.email = this.phData.selectedOwnerTypeContact[1].value;
    }

    /* Create new party if Policy holder is other */
    private createPolicyHolderOtherParty() {
        let partyData = {
            "firstName": this.phData.selectedOwnerTypeData[0].value,
            "lastName": this.phData.selectedOwnerTypeData[1].value,
            "maidenName": this.phData.selectedOwnerTypeData[3] ? this.phData.selectedOwnerTypeData[2].value : '',
            "peselId": this.phData.selectedOwnerTypeData[3] ? this.phData.selectedOwnerTypeData[3].value : this.phData.selectedOwnerTypeData[2].value,
            "typeOfOwnerShip": "PP",
            "roleName": "PH",
            "companyName": "",
            "regon":"",
            "mainOwner": false,
            "partyOwnerType": "ot"
        };
        return partyData;
    }

    /* Assign Residential Address to Policy holder party */
    private assignResAddressDataToPHParty(policyHolder) {
        policyHolder['postalCode'] = this.phData.selectedOwnerTypeAddrRes[0].value;
        policyHolder['city'] = this.phData.selectedOwnerTypeAddrRes[1].value;
        policyHolder['streetName'] = this.phData.selectedOwnerTypeAddrRes[2].value;
        policyHolder['houseNo'] = this.phData.selectedOwnerTypeAddrRes[3].value;
        policyHolder['flatNo'] = this.phData.selectedOwnerTypeAddrRes[4].value;
        policyHolder['mailingAddressSame'] = this.phData.isMailingAddSame == "true" ? "Y" : (this.phData.isMailingAddSame == "false" ? "N" : "");
        return policyHolder;
    }

    /* Assign mailing Address to Policy holder party */
    private assignMailAddressDataToParty(policyHolder) {
        policyHolder['mailingPostalCode'] = this.phData.selectedOwnerTypeAddrMail[0].value;
        policyHolder['mailingCity'] = this.phData.selectedOwnerTypeAddrMail[1].value;
        policyHolder['mailingStreetName'] = this.phData.selectedOwnerTypeAddrMail[2].value;
        policyHolder['mailingHouseNo'] = this.phData.selectedOwnerTypeAddrMail[3].value;
        policyHolder['mailingFlatNo'] = this.phData.selectedOwnerTypeAddrMail[4].value;
        return policyHolder;
    }

    /* Assign Main owner Residential address if main owner is not policy holder */
    private assignResAddMainOwnerParty(mainOwnerParty) {
        if (this.phData.nonPHAddrCheck.mainOwner == "no") {
            mainOwnerParty = this.assignAddToNonPh(mainOwnerParty, this.phData.mainOwnerAddrRes);            
        } else {
            mainOwnerParty['mailingAddressSame'] = "Y";
        }
        return mainOwnerParty;
    }
    
    /* Assign Co owner 1 Residential address if Co owner 1 is not policy holder */
    private assignResAddCoOwnerParty(coOwner1Party) {
        if (this.phData.nonPHAddrCheck.coOwner1 == "no") {
            coOwner1Party = this.assignAddToNonPh(coOwner1Party, this.phData.coOwner1AddrRes);
        } else {
            coOwner1Party['mailingAddressSame'] = "Y";
        }
        return coOwner1Party;
    }

    /* Assign Co owner 2 Residential address if Co owner 2 is not policy holder */
    private assignResAddCoOwner2Party(coOwner2Party) {
        if (this.phData.nonPHAddrCheck.coOwner2 == "no") {
            coOwner2Party = this.assignAddToNonPh(coOwner2Party, this.phData.coOwner2AddrRes);            
        } else {
            coOwner2Party['mailingAddressSame'] = "Y";
        }

        return coOwner2Party;
    }

    private assignAddToNonPh(party, address){
        let nonPhParty = party;
        nonPhParty['mailingAddressSame'] = "N";
        nonPhParty['postalCode'] = address[0].value;
        nonPhParty['city'] = address[1].value;
        nonPhParty['streetName'] = address[2].value;
        nonPhParty['houseNo'] = address[3].value;
        nonPhParty['flatNo'] = address[4].value;

        return nonPhParty;
    }



}