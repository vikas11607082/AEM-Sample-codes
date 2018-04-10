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
import { Chronology } from './chronology';
import { DateTimeField } from './dateTimeField';
import { DateTimeFieldType } from './dateTimeFieldType';


export interface LocalDateTime {
    era?: number;
    dayOfMonth?: number;
    dayOfWeek?: number;
    dayOfYear?: number;
    year?: number;
    chronology?: Chronology;
    weekOfWeekyear?: number;
    secondOfMinute?: number;
    millisOfSecond?: number;
    millisOfDay?: number;
    monthOfYear?: number;
    hourOfDay?: number;
    minuteOfHour?: number;
    weekyear?: number;
    yearOfEra?: number;
    yearOfCentury?: number;
    centuryOfEra?: number;
    fields?: Array<DateTimeField>;
    values?: Array<number>;
    fieldTypes?: Array<DateTimeFieldType>;
}
