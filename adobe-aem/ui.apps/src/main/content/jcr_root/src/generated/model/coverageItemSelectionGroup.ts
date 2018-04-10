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
import { ExtensionCoverageItemSelectionGroup } from './extensionCoverageItemSelectionGroup';
import { HALEmbeddedElements } from './hALEmbeddedElements';
import { HALLinks } from './hALLinks';
import { LinkCoverageItemSelectionGroup } from './linkCoverageItemSelectionGroup';
import { MetaInfoList } from './metaInfoList';


export interface CoverageItemSelectionGroup {
    minNum?: number;
    maxNum?: number;
    self?: LinkCoverageItemSelectionGroup;
    getLinks?: HALLinks;
    getEmbedded?: HALEmbeddedElements;
    getMeta?: MetaInfoList;
    extEntity?: ExtensionCoverageItemSelectionGroup;
}
