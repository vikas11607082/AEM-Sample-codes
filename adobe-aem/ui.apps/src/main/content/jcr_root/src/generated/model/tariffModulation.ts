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
import { ExtensionReduction } from './extensionReduction';
import { HALEmbeddedElements } from './hALEmbeddedElements';
import { HALLinks } from './hALLinks';
import { LinkReduction } from './linkReduction';
import { MetaInfoList } from './metaInfoList';
import { Selection } from './selection';


export interface TariffModulation {
    minValue?: number;
    maxValue?: number;
    selection?: Selection;
    effect?: TariffModulation.EffectEnum;
    value?: number;
    type?: string;
    code?: string;
    recurring?: boolean;
    percentage?: boolean;
    self?: LinkReduction;
    getLinks?: HALLinks;
    getEmbedded?: HALEmbeddedElements;
    getMeta?: MetaInfoList;
    extEntity?: ExtensionReduction;
}
export namespace TariffModulation {
    export type EffectEnum = 'REDUCTION' | 'SURCHARGE';
    export const EffectEnum = {
        REDUCTION: 'REDUCTION' as EffectEnum,
        SURCHARGE: 'SURCHARGE' as EffectEnum
    }
}
