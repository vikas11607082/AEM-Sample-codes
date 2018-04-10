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
import { ExtensionAdditionalCosts } from './extensionAdditionalCosts';
import { HALEmbeddedElements } from './hALEmbeddedElements';
import { HALLinks } from './hALLinks';
import { LinkAdditionalCosts } from './linkAdditionalCosts';
import { MetaInfoList } from './metaInfoList';
import { Money } from './money';


export interface AdditionalCosts {
    name?: string;
    value?: Money;
    additionalCostsType?: string;
    self?: LinkAdditionalCosts;
    getLinks?: HALLinks;
    getEmbedded?: HALEmbeddedElements;
    getMeta?: MetaInfoList;
    extEntity?: ExtensionAdditionalCosts;
}
