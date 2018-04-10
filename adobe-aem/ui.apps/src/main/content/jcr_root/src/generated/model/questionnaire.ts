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
import { ExtensionQuestionnaire } from './extensionQuestionnaire';
import { HALEmbeddedElements } from './hALEmbeddedElements';
import { HALLinks } from './hALLinks';
import { LinkLinkable } from './linkLinkable';
import { LinkQuestionnaire } from './linkQuestionnaire';
import { MetaInfoList } from './metaInfoList';
import { Period } from './period';


export interface Questionnaire {
    validityPeriod?: Period;
    questionnaireType?: string;
    dateTypeRelation?: string;
    obligationType?: string;
    classProductLink?: LinkLinkable;
    sortingNumber?: number;
    defaulted?: boolean;
    roleType?: string;
    platformType?: string;
    self?: LinkQuestionnaire;
    getLinks?: HALLinks;
    getEmbedded?: HALEmbeddedElements;
    getMeta?: MetaInfoList;
    extEntity?: ExtensionQuestionnaire;
}