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
import { BenefitsEntitlement } from './benefitsEntitlement';
import { CoverageCluster } from './coverageCluster';
import { CoverageItem } from './coverageItem';
import { CoverageItemSelectionGroup } from './coverageItemSelectionGroup';
import { Discount } from './discount';
import { ExtensionCoverage } from './extensionCoverage';
import { HALEmbeddedElements } from './hALEmbeddedElements';
import { HALLinks } from './hALLinks';
import { Interval } from './interval';
import { LinkBonusMalusInformation } from './linkBonusMalusInformation';
import { LinkClassProduct } from './linkClassProduct';
import { LinkCoverage } from './linkCoverage';
import { LinkCoverageSelectionGroup } from './linkCoverageSelectionGroup';
import { MetaInfoList } from './metaInfoList';
import { Money } from './money';
import { Period } from './period';
import { Reduction } from './reduction';
import { Selection } from './selection';
import { TariffModulation } from './tariffModulation';


export interface Coverage {
    name?: string;
    description?: string;
    status?: string;
    coverageClusters?: Array<CoverageCluster>;
    selectionGroup?: LinkCoverageSelectionGroup;
    classProductSign?: string;
    coverageInterval?: Interval;
    coverageSortingNumber?: number;
    benefitDuration?: Period;
    restorationFlag?: boolean;
    bonusMalusInfoLink?: LinkBonusMalusInformation;
    coverageItemGroups?: Array<CoverageItemSelectionGroup>;
    restorationType?: string;
    insurancePeriod?: Period;
    benefitsEntitlements?: Array<BenefitsEntitlement>;
    paymentDuration?: Period;
    coverageItems?: Array<CoverageItem>;
    selection?: Selection;
    reductions?: Array<Reduction>;
    discount?: Discount;
    modulations?: Array<TariffModulation>;
    insuranceSum?: Money;
    effectiveDate?: string;
    tariffDate?: string;
    tariff?: string;
    classProduct?: LinkClassProduct;
    bonusMalus?: string;
    self?: LinkCoverage;
    getLinks?: HALLinks;
    getEmbedded?: HALEmbeddedElements;
    getMeta?: MetaInfoList;
    extEntity?: ExtensionCoverage;
}
