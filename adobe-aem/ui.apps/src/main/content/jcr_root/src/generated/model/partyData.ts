/**
 * QB dispatcher rest interface
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.9-SNAPSHOT
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { Driver } from './driver';
import { IdentificationDocumentData } from './identificationDocumentData';


export interface PartyData {
    firstName?: string;
    lastName?: string;
    maidenName?: string;
    peselId?: string;
    companyName?: string;
    regon?: string;
    roleName?: string;
    typeOfOwnerShip?: string;
    mainOwner?: boolean;
    partyOwnerType?: string;
    streetName?: string;
    houseNo?: string;
    flatNo?: string;
    postalCode?: string;
    city?: string;
    mailingAddressSame?: string;
    mailingStreetName?: string;
    mailingHouseNo?: string;
    mailingFlatNo?: string;
    mailingPostalCode?: string;
    mailingCity?: string;
    partyId?: string;
    roleId?: string;
    identificationDocument?: IdentificationDocumentData;
    driver?: Driver;
}
