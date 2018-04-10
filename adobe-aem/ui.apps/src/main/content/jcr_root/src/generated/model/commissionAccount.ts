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
import { ExtensionCommissionAccount } from './extensionCommissionAccount';
import { HALEmbeddedElements } from './hALEmbeddedElements';
import { HALLinks } from './hALLinks';
import { LinkCommissionAccount } from './linkCommissionAccount';
import { MetaInfoList } from './metaInfoList';


export interface CommissionAccount {
    commissionSchemaLife?: string;
    commissionSchemaProperty?: string;
    bookableOption?: string;
    accountType?: string;
    accountNumber?: string;
    openingDate?: string;
    closingDate?: string;
    bookable?: boolean;
    self?: LinkCommissionAccount;
    getLinks?: HALLinks;
    getEmbedded?: HALEmbeddedElements;
    getMeta?: MetaInfoList;
    extEntity?: ExtensionCommissionAccount;
}
