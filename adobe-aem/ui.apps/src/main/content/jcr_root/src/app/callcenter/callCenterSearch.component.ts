import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PageNavigateService } from '../callcenter/page.navigate';
import { Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CislService } from './../util/util.cisl.service';
import { CCRouteService } from './ccrouter.service';
import { SortPipe } from '../callcenter/sorting.pipe';
import { LogoutService } from '../logout/logout.service';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../commons/constants';
import 'rxjs/add/operator/map';
@Component({
    templateUrl: './callCenterSearch.component.html',
})

export class CallCenterSearch extends Constants implements OnInit {

    constructor(private cislService: CislService, private logoutService:LogoutService, private router: Router, private activeRoute: ActivatedRoute, private pageNavigation: PageNavigateService, private http: HttpClient, private ccrouteservice: CCRouteService) {super(); }

    public requestPerPage: boolean = false;
    public allItems: any[] = [];
    public page: any = {};
    public pagedItems: any[];
    public txtQuote: string = '';
    public txtEmailId: string = '';
    public firstName: any;
    public surName: any;
    public _totalItems: any;
    selectedField = 'name';
    public itemsPerPage: number = 10;
    allItemsCount: any = 1;
    public isEmailValid: boolean = true;
    public isQuoteIdValid: boolean = true;
    public clearRecord: boolean = false;
    public params: String = "";
    public userNameForCCSearch:string='';
    public ticketId: String = ""; 
    private url = '?channel=CC_CHANNEL';
    private urlRestore = '?channel=CC_CHANNEL#/restore?';
    public  showCCSearchPage = false;   
    showUnAuthPopup: boolean = false; 


    ngOnInit() {        
        this.ticketId = this.ccrouteservice.getTicketId();
        this.userNameForCCSearch = this.ccrouteservice.getUserId();
        this.urlRestore =  this.urlRestore + 'uname=' + this.userNameForCCSearch + '&ticket=' + this.ticketId;
        this.cislService.getAuthData(this.ticketId).subscribe(data => { this.serializeAuthData(data); }, err => { this.serializeErr(err); });      
    }
    serializeAuthData(data) {
        this.showCCSearchPage = true;
    }
    serializeErr(err) {
        if(err.error.errorCode == this.ERR_SSO){
            location.assign("/cclogin");
        }else if(err.error.errorCode == this.ERR_ACCESS_DENIED){
            sessionStorage.clear();
            this.router.navigate(["/unauthoriseduser"]);
        }        
    }
    createNewQuote() {
    	this.cislService.checkLoggedIn(this.ticketId).subscribe(data => { this.openCarDetailsPage(data); }, err => { this.serializeErr(err); });        
    }
    openCarDetailsPage(data){
    	window.open(this.url + '#/cardetails');
    }
    clearSearch() {
        this.txtQuote = '';
        this.txtEmailId = '';
        this.allItems = [];
        this.pagedItems = null;
        this.clearRecord = false;
    }
    setFieldName(name) {
        if (this.selectedField === name) {
            this.selectedField = '-' + this.selectedField;
        } else {
            this.selectedField = name;
        }
    }
    addClass(event): void {
        event.target.classList.add('is-filled');
    }
    removeClass(event): void {
        if (event.target.classList.contains('ng-invalid')) {
            event.target.classList.add('is-filled');
        }
    }
    setPage(page1: number) {
        if (page1 < 1 || page1 > this.page.totalPages) {
            return;
        }
        this.page = this.pageNavigation.getPage(this.allItems.length, page1);
        this.pagedItems = this.allItems.slice(this.page.startIndex, this.page.endIndex + 1);
    }
    emailValidation(event) {
        if (this.txtEmailId != '') {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            this.isEmailValid = re.test(event.target.value);
        }
    }
    removeSpace(event) {
        let k = event.charCode;
        if (k == 32) {
            return false;
        }
    }

    omit_special_char_space(event) {
        let k;
        let val = false;
        k = event.charCode;
        if ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 0 || k == 45 || k >= 128 || k == 32) {
            return true;
        } else {
            return false;
        }
    }

    acceptOnlyNumbers(event) {
        let k = event.charCode;
        let val = false;
        if ((k >= 48 && k <= 57 || k == 8 || k == 0) || (k == 118 && event.keyCode == 0)) {
            return;
        } else {
            return val;
        }
    }
    quoteValiation(event) {
        if (this.txtQuote != '') {
            let re = /^(\+?\d+)$/g;
            let val = event.target.value;
            this.isQuoteIdValid = re.test(val);
        }
    }
    totalItem() {
        this._totalItems = this.pageNavigation.getPage(this.allItems.length);
    }
    searchWrong() {
        this.allItems = Object.assign([], this.allItems);
    }
    retriveData(quoteId: any, email: any) {        
        if (quoteId == '' && email != '') {
            window.open(this.urlRestore + '&email=' + email);
        } if (email == '' && quoteId != '') {
            window.open(this.urlRestore + '&quoteId=' + quoteId);
        } if (quoteId != '' && email != '') {
            window.open(this.urlRestore + '&quoteId=' + quoteId + '&email=' + email);
        }
    }
    test: any;
    btnSearch() {
        this.allItems = [];
        let quoteEmail = this.txtEmailId;
        let quoteId = this.txtQuote;
        if (quoteEmail == null) {
            quoteEmail = '';
        } if (quoteId == null) {
            quoteId = '';
        }
        if (quoteId != '' && quoteEmail != '') {
        	this.cislService.checkLoggedIn(this.ticketId).subscribe(data => { this.callSearch(data,quoteId,quoteEmail); }, err => { this.serializeErr(err); });
            
        } else {
           this.cislService.checkLoggedIn(this.ticketId).subscribe(data => { this.callSearch(data,quoteId,quoteEmail); }, err => { this.serializeErr(err); });
        }
    }
    callSearch(res,quoteId,quoteEmail){
    	this.cislService.getDataForCallCenterSearch(quoteId, quoteEmail).subscribe(data => { this.serializeSearchData(data)});
    }
    serializeSearchData(data) {
        if (data != null) {
            for (let i = 0; i < data.length; i++) {
                let searchItems = {
                    "name": data[i].firstName,
                    "surname": data[i].lastName,
                    "companyname": data[i].companyName,
                    "peselnumber": data[i].peselId,
                    "regonnumber": data[i].regon,
                    "quoteid": data[i].quoteId,
                    "policyid": data[i].policyNumber,
                    "price": data[i].price,
                    "phonenumber": data[i].phoneNumber,
                    "emailaddress": data[i].emailId,
                    "town": data[i].town,
                    "street": data[i].street,
                    "zipcode": data[i].zipCode,
                    "carbrand": data[i].vehicleBrand,
                    "carmodel": data[i].vehicleModel,
                    "vehiclenumber": data[i].licensePlateNumber,
                    "sourceofsale": data[i].typeOfChannel,
                    "quotedate": data[i].lastUpdateDate
                }
                this.allItems.push(searchItems);
            }
            this.clearRecord = true;
            if (this.allItems.length >= 10) {
                this.requestPerPage = true;
            }
            this.setPage(1);
        } else {
            console.log("No data");
        }
    }
    clickLogoutCC(){
        this.logoutService.showLogoutConfirm(true);
    }
}
