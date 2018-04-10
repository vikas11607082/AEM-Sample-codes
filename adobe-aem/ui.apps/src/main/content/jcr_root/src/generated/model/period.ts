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
import { DurationFieldType } from './durationFieldType';
import { PeriodType } from './periodType';


export interface Period {
    months?: number;
    hours?: number;
    millis?: number;
    minutes?: number;
    seconds?: number;
    days?: number;
    years?: number;
    weeks?: number;
    periodType?: PeriodType;
    values?: Array<number>;
    fieldTypes?: Array<DurationFieldType>;
}