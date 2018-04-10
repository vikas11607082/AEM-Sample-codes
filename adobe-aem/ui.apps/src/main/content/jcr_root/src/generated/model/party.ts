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
import { ExtensionObject } from './extensionObject';
import { ExternalSystemReference } from './externalSystemReference';
import { ForeignTaxIdentification } from './foreignTaxIdentification';
import { HALEmbeddedElements } from './hALEmbeddedElements';
import { HALLinks } from './hALLinks';
import { LinkAccountManager } from './linkAccountManager';
import { LinkContactChannel } from './linkContactChannel';
import { LinkObject } from './linkObject';
import { LinkPaymentData } from './linkPaymentData';
import { MetaInfoList } from './metaInfoList';


export interface Party {
    currency?: string;
    customerNumber?: string;
    accountManager?: LinkAccountManager;
    externalCommercialFlag?: boolean;
    internalCommercialFlag?: boolean;
    channelpresale?: LinkContactChannel;
    channelpostsale?: LinkContactChannel;
    preferredPaymentMethod?: LinkPaymentData;
    loyaltyPrograms?: Array<string>;
    preferredLanguage?: string;
    externalSystemReferences?: Array<ExternalSystemReference>;
    preferPaperlessCommunication?: boolean;
    businessSegment?: string;
    policyHolderType?: string;
    accountManagerNumber?: string;
    foreignTaxIdentities?: Array<ForeignTaxIdentification>;
    vatIN?: string;
    privacyFlag?: boolean;
    channelsale?: LinkContactChannel;
    partyType?: string;
    partyCategory?: Array<string>;
    lead?: boolean;
    partySign?: string;
    self?: LinkObject;
    getLinks?: HALLinks;
    getEmbedded?: HALEmbeddedElements;
    getMeta?: MetaInfoList;
    extEntity?: ExtensionObject;
}