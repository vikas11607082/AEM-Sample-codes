import {Inject, Injectable, Optional} from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import {API_BASE_URL} from '../commons/services/apibaseurl.config';




@Pipe({name: 'imagepathresolver'})
export class ImagePathResolverPipe implements PipeTransform {

    constructor( @Inject(API_BASE_URL) private apiBaseUrl: string  ) {}

    transform(value: string, args: string[]): any {
        return this.apiBaseUrl ? this.apiBaseUrl + value : value;
    }


}