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
import { Beneficiary } from './beneficiary';
import { ExtensionBenefitsEntitlement } from './extensionBenefitsEntitlement';
import { HALEmbeddedElements } from './hALEmbeddedElements';
import { HALLinks } from './hALLinks';
import { LinkBenefitsEntitlement } from './linkBenefitsEntitlement';
import { LinkCoverage } from './linkCoverage';
import { LinkCoverageItem } from './linkCoverageItem';
import { MetaInfoList } from './metaInfoList';


export interface BenefitsEntitlement {
    type?: string;
    coverageItem?: LinkCoverageItem;
    coverage?: LinkCoverage;
    beneficiaries?: Array<Beneficiary>;
    risk?: string;
    irrevocable?: boolean;
    self?: LinkBenefitsEntitlement;
    getLinks?: HALLinks;
    getEmbedded?: HALEmbeddedElements;
    getMeta?: MetaInfoList;
    extEntity?: ExtensionBenefitsEntitlement;
}
