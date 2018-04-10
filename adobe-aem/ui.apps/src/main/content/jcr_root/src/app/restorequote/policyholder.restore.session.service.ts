import { Injectable } from '@angular/core';
import { PolicyHolderPageDataDefinitionService } from './../commons/services/policyholder.page.data.definition.service.';
@Injectable()
export class PolicyHolderSessionRestoreService {
    constructor(private phDataDef: PolicyHolderPageDataDefinitionService) { }

    public phData = {};

    public policHolderSessionRestore(quoteData) {
        this.assignVehicleDetailsToSession(quoteData.vehicle);
        this.assignPolicyHolderDetailsToSession(quoteData.party, quoteData.quote);
        this.phData['consentsArr'] = [];
        this.phData['addressIds'] = this.phDataDef.addressIds;
        this.phData['contactIds'] = this.phDataDef.contactIds;
        this.phData['roleIds'] = this.phDataDef.roleIds;
        this.phData['partyIds'] = this.phDataDef.partyIds;
        this.phData['isFromRestore'] = true;
        return this.phData;
    }

    private assignVehicleDetailsToSession(vehicle) {
        this.phData['vin'] = vehicle.vehicleIdentificationNumber;
        this.phData['licensePlateNo'] = vehicle.licensePlateNumber;
        this.phData['noOfKeys'] = String(vehicle.numberOfKeys);
        this.phData['isCarDamaged'] = vehicle.majorExistingDamages == true ? "damagedYes" : "damagedNo";
        this.phData['damagedDesc'] = vehicle.existingDamageDescription;
        this.phData['licensePlate'] = !vehicle.licensePlateExists;
    }

    private assignPolicyHolderDetailsToSession(parties, quote) {
        this.phData['nonPHAddrCheck'] = this.phDataDef.nonPHAddrCheck;
        this.phData['nonPH'] = [];
        for(let i=0; i < parties.length; i++){
            if(parties[i].roleName == "PH" || parties[i].roleName == "DPH"){
                this.phData['policyHolderType'] = this.getPolicyHolderType(parties[i].partyOwnerType, parties[i].roleName);
                this.phData['selectedOwnerTypeData'] = this.getSelectedOwnerTypeData(parties[i]); 
                this.phData['selectedOwnerTypeContact'] = this.getSelectedOwnerTypeContact(quote);                
                this.phData['selectedOwnerTypeAddrRes'] = this.getselectedOwnerTypeAddRes(parties[i]);
                this.phData['selectedOwnerTypeAddrMail'] = this.getselectedOwnerTypeAddrMail(parties[i]);     
            }

            if(parties[i].hasOwnProperty('mailingAddressSame') && (parties[i].roleName !== "PH" || parties[i].roleName !== "DPH")){
                let partyType = this.getPolicyHolderType(parties[i].partyOwnerType, parties[i].roleName);
                this.phData['nonPH'].push(partyType);
                if(parties[i].mailingAddressSame == "N"){
                    this.phData['nonPHAddrCheck'][partyType] = "no";
                    this.assignNonPhAddToSession(parties[i],partyType);
                } else {
                    this.phData['nonPHAddrCheck'][partyType] = "yes";
                }
            }
        }
    }

    private getSelectedOwnerTypeData(party){
        let selectedOwnerTypeData = this.phDataDef.other;
        selectedOwnerTypeData[0].value = party.firstName;
        selectedOwnerTypeData[1].value = party.lastName;
        selectedOwnerTypeData[2].value = party.maidenName;
        selectedOwnerTypeData[3].value = party.peselId;
        
        return selectedOwnerTypeData;

    }

    private getSelectedOwnerTypeContact(quote){
        let selectedOwnerTypeContact = this.phDataDef.selectedOwnerTypeContact;
        selectedOwnerTypeContact[0].value = quote.phoneNumber;
        selectedOwnerTypeContact[1].value = quote.email;        
        return selectedOwnerTypeContact;
    }

    private getselectedOwnerTypeAddRes(party){
        let selectedOwnerTypeAddRes = this.phDataDef.selectedOwnerTypeAddrRes;
        selectedOwnerTypeAddRes[0].value = party.postalCode;
        selectedOwnerTypeAddRes[1].value = party.city;
        selectedOwnerTypeAddRes[2].value = party.streetName;
        selectedOwnerTypeAddRes[3].value = party.houseNo;
        selectedOwnerTypeAddRes[4].value = party.flatNo;      
        return selectedOwnerTypeAddRes;
    }

    private getselectedOwnerTypeAddrMail(party){
        let selectedOwnerTypeAddMail = this.phDataDef.selectedOwnerTypeAddrMail;
        this.phData['isMailingAddSame'];
        if(party.mailingAddressSame !== ""){
            this.phData['isMailingAddSame'] = party.mailingAddressSame == "Y" ? "true" : "false";
            if( party.mailingAddressSame == "N"){
                selectedOwnerTypeAddMail[0].value = party.mailingPostalCode;
                selectedOwnerTypeAddMail[1].value = party.mailingCity;
                selectedOwnerTypeAddMail[2].value = party.mailingStreetName;
                selectedOwnerTypeAddMail[3].value = party.mailingHouseNo;
                selectedOwnerTypeAddMail[4].value = party.mailingFlatNo;              
            }
        } 

        return selectedOwnerTypeAddMail;
    }

    private assignNonPhAddToSession(party, partyType){
        switch(partyType){
            case "mainOwner" :
            this.phData['mainOwnerAddrRes'] = this.getNonPhAdd(party,this.phDataDef.mainOwnerAddrRes);
            break;

            case "coOwner1" :
            this.phData['coOwner1AddrRes'] = this.getNonPhAdd(party,this.phDataDef.coOwner1AddrRes);
            break;

            case "coOwner2" :
            this.phData['coOwner2AddrRes'] = this.getNonPhAdd(party,this.phDataDef.coOwner2AddrRes);
            break;
        }
    }

    private getNonPhAdd(party, address){
        let partyAdd = address;
        partyAdd[0].value = party.postalCode;
        partyAdd[1].value = party.city;
        partyAdd[2].value = party.streetName;
        partyAdd[3].value = party.houseNo;
        partyAdd[4].value = party.flatNo;
        return partyAdd;
        
        
    }

    private getPolicyHolderType(ownerType, roleName){
        let policyHolderType = "";
        switch (ownerType) {
            case "mo":
            policyHolderType = "mainOwner";
                break;
            case "co1":
            policyHolderType = "coOwner1";
                break;
            case "co2":
            policyHolderType = "coOwner2";
                break;
            case "ot":
            if(roleName == "DPH"){
                policyHolderType = "driver";
            } else {
                policyHolderType = "other";
            }

            break;
           
        }
 
        return policyHolderType;
    }
}