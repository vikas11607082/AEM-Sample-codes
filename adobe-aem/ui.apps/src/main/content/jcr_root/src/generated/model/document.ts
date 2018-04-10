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
import { ContactChannel } from './contactChannel';
import { ExtensionDocumentInfo } from './extensionDocumentInfo';
import { HALEmbeddedElements } from './hALEmbeddedElements';
import { HALLinks } from './hALLinks';
import { LinkDocument } from './linkDocument';
import { LinkDocumentCategory } from './linkDocumentCategory';
import { LinkDocumentInfo } from './linkDocumentInfo';
import { LocalDateTime } from './localDateTime';
import { MetaInfoList } from './metaInfoList';


export interface Document {
    data?: string;
    fileName?: string;
    url?: string;
    status?: string;
    creator?: string;
    documentCategory?: LinkDocumentCategory;
    deliveryMethod?: string;
    relatedDocuments?: Array<LinkDocumentInfo>;
    documentDescription?: string;
    documentChannel?: string;
    documentStorageType?: string;
    documentType?: string;
    subject?: string;
    byteSize?: number;
    direction?: Document.DirectionEnum;
    creationDate?: LocalDateTime;
    addresseeData?: ContactChannel;
    documentId?: LinkDocument;
    signed?: boolean;
    statusDetails?: Array<string>;
    mimeType?: string;
    self?: LinkDocumentInfo;
    getLinks?: HALLinks;
    getEmbedded?: HALEmbeddedElements;
    getMeta?: MetaInfoList;
    extEntity?: ExtensionDocumentInfo;
}
export namespace Document {
    export type DirectionEnum = 'INCOMING' | 'OUTGOING';
    export const DirectionEnum = {
        INCOMING: 'INCOMING' as DirectionEnum,
        OUTGOING: 'OUTGOING' as DirectionEnum
    }
}