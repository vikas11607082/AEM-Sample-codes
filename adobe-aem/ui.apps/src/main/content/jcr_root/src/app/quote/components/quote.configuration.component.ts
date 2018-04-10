import { Component, Renderer, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CislService} from '../../util/util.cisl.service';
import { SaveQuoteService } from '../../savequote/quote.save.service';
import { Router } from '@angular/router';
import { AEMSet, AEMTrack,AEMClearVars } from '../../commons/analytics';

import {Observable} from 'rxjs/Observable';
import { SaveButtonHideShowService } from '../../savequote/save.button.hide.show.service';
import { RestoreQuoteSessionService } from '../../restorequote/quote.restore.session';
declare var window: any;
@Component({
  
  templateUrl: '../html/quote.configuration.component.html'
})
export class ConfigurationComponent implements OnInit{

  constructor(private cislService: CislService, private saveQuoteService:SaveQuoteService,private router: Router,
              private _saveButtonShowHide:SaveButtonHideShowService, private _restoreSession:RestoreQuoteSessionService) { }
  public driverPageData: any;
  public bundleData:any;
  public startDateOfInsurance: any = '';
  public carDetailsData:any;
  public carValue: any;
  public contractId = '';
  public propertyId = '';
  public ownersData: any;
  public carModel: string = '';
  public carVersionName: string = '';
  public carBrand:string='';
  public paymentModel=[];
  public payPolicyModel=[];
  public configurationData : any;
  //testing
  public options:any=[];
  public secondOptions:any;
  public  personalizedArr:any=[];
  public isSelGrpCovItem:boolean=false;
  public yourChoiceArrayCollection=[];
  public yourChoiceArrayCollection1=[];
  
  public policyId: string = '';
  public content:string ='';
  public installmentType=[];
  public paymentType=[];
  public installmentModel:any;
  public paymentTypeModel:any;
  public addPaymentFrequency:string ='';
  installmentTypeMap = new Object();
  paymentTypeMap= new Object();
  public premiumValue:any;
  public grossValue:any
  public selectedInstallment={"value":"","label":""};

  public showPayBank: boolean = true;
  public todayDate: any;
  public option: any;
  public selectedPaymentType={"value":"","label":""};
  public sessionData:any;
  public grossPremium:any
  public finalAmount:any;
  public splitAmount:any;
  public optionItemGross:any;
  public totalAmount:any;
  public totalAmount2:any;
  public applicationData:any;
  public  curencyVar='zł';
  private currentPageId:number= 6;
  private isUpdateConfigOnRestoreCalled : boolean = false;
  private isPaymentTypeSuccess : boolean = false;
  private isInstallmentTypeSuccess : boolean = false;
  public showPriceRecalculationPopup:boolean = false;
  public disabledNext:boolean = false;

 @ViewChild('discOptions') discOptions: ElementRef;
  discountOptions = ['15% znizka online', '15% for purchase on next policy purchase'];
  selectedDiscountOpt = "15% znizka online";
  ngOnInit()
  {
    this.options=[];
    this.personalizedArr=[];
    this.secondOptions = [];
    this.yourChoiceArrayCollection=[];
    this.getContractId();
    this.getPolicyId();
    this.getSessionData();    
    this._saveButtonShowHide.showQuoteId();
    this._saveButtonShowHide.showSaveButton();
    this.getCarValueDetails();
 /*code to get current pageName and pageID and send it to adobe analytics*/
    var path = window.location.href;
    var pageData=path.split("#/");
    var currentPageName=pageData[1];
     
	this.todayDate = new Date();
     if (currentPageName=="configuration")
    {
	   var pageName= "Configuration page";
     var pageID="car/S6configuration:Step6";
    
	 		/* ********************DO-NOT-TOUCH***************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.spapageview', pageName);
               AEMTrack('spapageview');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */
     } //end if condition
  
	 /*code to get current pageName and pageID and send it to adobe analytics end here*/
   
    this.driverPageData = JSON.parse(sessionStorage.getItem("driverData"));
    this.ownersData = JSON.parse(sessionStorage.getItem("ownerData"));
    this.carDetailsData = JSON.parse(sessionStorage.getItem("carDetails"));
    this.bundleData=JSON.parse(sessionStorage.getItem("productBundleData"));
   
    if (this.carDetailsData != null) {
      this.carModel=this.carDetailsData.carModel;
      this.carBrand=this.carDetailsData.carBrand;
      this.carVersionName=this.carDetailsData.carVersionName;
    }

    if (this.driverPageData != null) {
      this.startDateOfInsurance = new Date(this.driverPageData.policyStartYear, this.driverPageData.policyStartMonth - 1, this.driverPageData.policyStartDate);
      let todayDay = this.todayDate.getDate();
      let todayMonth = this.todayDate.getMonth();
      let todayYear = this.todayDate.getFullYear();
      if (todayDay == this.driverPageData.policyStartDate && todayMonth == this.driverPageData.policyStartMonth - 1 && todayYear == this.driverPageData.policyStartYear) {
        this.showPayBank = false;
      }
    }

    /* Save quote configuration pag */
    this.saveQuoteService.currentPageId = this.currentPageId;
    this.saveQuoteService.SaveQuote.subscribe(() => {
      if (this.saveQuoteService.currentPageId == this.currentPageId) { 
        if (this.saveQuoteService.isFromEmailPhonePopup) {
          this.applicationData = JSON.parse(sessionStorage.getItem('Application'));
        }       
        this.saveConfigurationData();
      }
    }); 
    this.showReCalculationPopup();  
  }

  private showReCalculationPopup(){    
    if(this._restoreSession.isPremiumChanged){
      this.showPriceRecalculationPopup = true;
      this._restoreSession.isPremiumChanged = false;
    }
    
  }

  public closeRecalculatePopup(event){
    this.showPriceRecalculationPopup = false;
  }

  clickBackButton() {
        this.saveQuoteService.autoSavePageData();
        this.router.navigateByUrl('/productbundle');
    }

  //next policyholder
  clickNextButton() { 
    this.disabledNext = true;  
    this.saveQuoteService.autoSavePageData();
    this.updatePaymentDetails();
    this.router.navigateByUrl('/policyholder');
  }
    

  getInitialData() 
  {
    this.cislService.getPaymentServicesInstallmentType(this.contractId, this.policyId).subscribe(data => this.serializeInstallmentTypeData(data));
    this.cislService.getPaymentServicesPaymentType(this.contractId, this.policyId).subscribe(data => this.serializePaymentTypeData(data));
    this.cislService.getUpSellOfferConfiguration(this.contractId, this.policyId).subscribe(data => this.serializeUpSellOffer(data));
    
  }

  /* Get Property value */
  getCarValueDetails() {
    this.cislService.getPropertyDetails(this.contractId, this.propertyId).subscribe(data => this.assignCarValue(data));
  }


  carModelCheck(sel: any): void 
  {
    //TODO
  }

  assignCarValue(data) 
  {
    let value = data.currentValue;
    if (value != undefined) {
      value = value.split(' ');
      this.carValue = Number(value[1]);
       this.carValue =  this.carValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      
    }
  }

  serializeUpSellOffer(data)
  { 
    this.configurationData=data;
    this.yourChoiceArrayCollection=[];
    this.personalizedArr =[];    
    for(let obj of this.installmentModel){
      if(obj.value == this.configurationData.policyDetail.paymentFrequency){
        this.selectedInstallment.value =  this.configurationData.policyDetail.paymentFrequency;
        this.selectedInstallment.label =  obj.label;
        break;
      }
    }
    for(let obj of this.paymentTypeModel){
      if(this.configurationData.paymentData.extEntity == undefined){
        if(obj.value == "BANK_TRANSFER"){
          this.selectedPaymentType.value = obj.value;
          this.selectedPaymentType.label = obj.label;
          break;
        }
      }else {
        if(obj.value == "ONLINE_PAYMENT"){
          this.selectedPaymentType.value = obj.value;
          this.selectedPaymentType.label = obj.label;
          break;
        }
      }
    }
    this.personalizedInsuranceOffer();
    this.checkPremium(this.selectedInstallment);
  }

  /* Below function is to show personalizedInsuranceOffer Items   */
  personalizedInsuranceOffer():void
  {   var coverName;
      this.finalAmount =0;
      this.personalizedArr = [];
      for(let coverage of this.configurationData.policyDetail.coverages)
      { 
          coverName=coverage.name;
          this.options=[];
          this.options.coverName=coverName;
          this.secondOptions.coverName=coverName;
          if(coverage.hasOwnProperty("selectionGroup"))
          {
            this.isSelGrpCovItem=false;
              if(coverage.coverageItems[0].hasOwnProperty("subCoverageItems"))
              for(let coverageItem of coverage.coverageItems[0].subCoverageItems) 
              { 
                  if(coverageItem.hasOwnProperty("selectionGroup"))
                  {                            
                      coverageItem.subCoverageItems[0].coverName=this.options.coverName;
                      this.options=coverageItem.subCoverageItems;
                      this.options[0].coverageItemDescription=coverageItem.description != undefined?(coverageItem.description):"";
                     
                      for(let optionsItem of this.options)
                      {
                          this.getOptionPrice(optionsItem);
                          optionsItem.selGroup = true;
                      }
                     this.personalizedArr.push(this.options);
                     this.isSelGrpCovItem=true;
                  }
          
              } 

              if(!this.isSelGrpCovItem)
              {
                  coverage.coverageItems[0].coverName=this.secondOptions.coverName;
                  this.secondOptions= coverage.coverageItems;
                  this.secondOptions[0].coverageItemDescription=coverage.description != undefined?(coverage.description):"";
                  for(let optionItem of this.secondOptions )
                  {
                    this.getOptionPrice(optionItem);
                    optionItem.selGroup = false;
                  } 
                  this.personalizedArr.push(this.secondOptions);
              }
          }
          this.yourChoice(coverage);  
      }
     let filteredData = [];
     Observable.merge(this.yourChoiceArrayCollection)
.distinct((x) => x.coverName)
.subscribe(y => {
 filteredData.push(y)
});
var duplicateData=[];
var arrayNeedTobeMatched=[];


var unique = function(origArr) {
  var newArr = [],
      origLen = origArr.length,
      found, x, y;

  for (x = 0; x < origLen; x++) {
      found = undefined;
      for (y = 0; y < newArr.length; y++) {
          if (origArr[x].coverName === newArr[y].coverName) {
              found = true;
              duplicateData.push(origArr[x]);
              arrayNeedTobeMatched.push(newArr[y]);
              break;
          }
      }
      if (!found) {
          newArr.push(origArr[x]);
      }
  }
  return newArr;
}
var arr = ['a', 'b', 'c', 'a', 'd', 'e', 'a', 'a', 'f', 'g', 'a'];


var arrUnique = unique(this.yourChoiceArrayCollection);
  }


  /* Below function is to show Your choice Items   */
  yourChoice(coverage: any):void
  {     var isParentCondition:boolean=false;
  
      for(let optionItem of coverage.coverageItems)
      {
        //TODO Adding condition for parent for 1st case->(7B 2ND CASE WHICH IS NOT MENTIONED)
        if(optionItem.selection.selected && this.getOptionPriceYourChoice(optionItem,coverage,false))
        {
          isParentCondition=false;  
        }else{

          if(optionItem.selection.selected && coverage.hasOwnProperty("selectionGroup"))
          {
              isParentCondition=true;
              this.getOptionPriceYourChoice(optionItem,coverage,isParentCondition);
          } 
        }
          if(optionItem.hasOwnProperty("subCoverageItems"))
          for(let resSubcoverage of optionItem.subCoverageItems)
          {
                     //TODO 3rd case i think it does not arise in this respons5->->(7B 1st case  WHICH IS MENTIONED, usecase subcoverageitems within coverageItems)
               if(resSubcoverage.selection.selected && this.getOptionPriceYourChoice(resSubcoverage,coverage,false))
              {
                isParentCondition=false;  
              
              }else
              {
                if(resSubcoverage.selection.selected && optionItem.hasOwnProperty("selectionGroup"))
                {
                 
                  isParentCondition=true;  
      
                    this.getOptionPriceYourChoice(resSubcoverage,coverage,isParentCondition); 
                }
              }
           
              
                     //TODO2nd case->->(7B 1st case  WHICH IS MENTIONED, usecase subcoverageitems within subcoverageitems)

              if(resSubcoverage.hasOwnProperty("subCoverageItems"))
              for(let innerResSubcoverage of resSubcoverage.subCoverageItems)
              {
                
                if(innerResSubcoverage.selection.selected && this.getOptionPriceYourChoice(innerResSubcoverage,coverage,false))
                {
                    isParentCondition=false;  
                }else
                {
                  if(innerResSubcoverage.selection.selected && resSubcoverage.hasOwnProperty("selectionGroup"))
                  {
                      isParentCondition=true;  
                      this.getOptionPriceYourChoice(innerResSubcoverage,coverage,isParentCondition);  
                  } 
                }              
              
              }
          }
      }
       
  }

  /* Below code is common code for taking price for option in your choice  */
  getOptionPriceYourChoice(optionItem: any,coverage:any,isParentCondition:boolean):boolean
  {  
     var grossPremiumGreaterThanZero:boolean=false;         
        for(let coveragePremium of this.configurationData.premium.coveragePremium)
        {
          for(let coverageItemPremium of coveragePremium.coverageItemPremium )
          {
            if (coverageItemPremium.coverageItemLink== optionItem.self)
            {
              if(isParentCondition)
              {
                optionItem.grossPremium=coverageItemPremium.grossPremium;
                optionItem.coverName=coverage.name;
                this.fillYourChoice(optionItem);
                grossPremiumGreaterThanZero=false;
              }
              else
              {
                if(  Number(coverageItemPremium.grossPremium.split("PLN ").pop())>0)
                { 
                    optionItem.grossPremium=coverageItemPremium.grossPremium;
                    optionItem.coverName=coverage.name;                   
                    this.fillYourChoice(optionItem);
                    grossPremiumGreaterThanZero=true;
                }else {
                  if(coverageItemPremium.hasOwnProperty("subCoverageItemPremiums")){
                    for(let subCoverageItemPremium of coverageItemPremium.subCoverageItemPremiums){
                      if(Number(subCoverageItemPremium.grossPremium.split("PLN ").pop())> 0){
                        optionItem.grossPremium = subCoverageItemPremium.grossPremium;
                        optionItem.coverName = coverage.name;
                        this.fillYourChoice(optionItem);
                        grossPremiumGreaterThanZero=true;
                      }
                    }
                  }
                }
              }
              
            }
            
            
            if(coverageItemPremium.hasOwnProperty("subCoverageItemPremiums"))
            for(let subCoverageItemPremium of coverageItemPremium.subCoverageItemPremiums)
                {
                    if(subCoverageItemPremium.hasOwnProperty("subCoverageItemPremiums"))
                    for(let coverageItemPremiumObj of subCoverageItemPremium.subCoverageItemPremiums)
                    {
                         
                          if (coverageItemPremiumObj.coverageItemLink== optionItem.self)
                          {
                              if(isParentCondition)
                              {
                                optionItem.grossPremium=coverageItemPremiumObj.grossPremium;
                                optionItem.coverName=coverage.name;
                              
                                 this.fillYourChoice(optionItem);
                                grossPremiumGreaterThanZero=false;

                              }else
                              {
                                if(  Number(coverageItemPremiumObj.grossPremium.split("PLN ").pop())>0)
                                { 
                                    optionItem.grossPremium=coverageItemPremiumObj.grossPremium;
                                    optionItem.coverName=coverage.name;                                  
                                    this.fillYourChoice(optionItem);
                                    grossPremiumGreaterThanZero=true;
                                }
                              }
                          }
                    }
              }
          }            
        }
        return grossPremiumGreaterThanZero;
      }
     
     
      fillYourChoice(option: any):void
     {   var optionItem = JSON.parse(JSON.stringify(option));
          var arrAdd:any=[];
          if(this.yourChoiceArrayCollection.length < 1){
            if(Number(option.grossPremium.split("PLN ")[1]>0) || this.checkPersOfferSec(option)){
              
              //Added for total calculation
              this.getTotal(optionItem);
              optionItem.grossPremium = Number(optionItem.grossPremium.split("PLN ")[1]) > 0 ? (optionItem.grossPremium) : "";
              arrAdd.push(optionItem);
             
           
              this.yourChoiceArrayCollection.push(arrAdd);
            }           
          }else {
            if(this.yourChoiceArrayCollection[this.yourChoiceArrayCollection.length-1][0].coverName ==  optionItem.coverName){
               if(Number(option.grossPremium.split("PLN ")[1]>0) || this.checkPersOfferSec(option)){ 
                //Added for total calculation
                this.getTotal(optionItem);
                optionItem.grossPremium = Number(optionItem.grossPremium.split("PLN ")[1]) > 0 ? (optionItem.grossPremium) : "";
               
                this.yourChoiceArrayCollection[this.yourChoiceArrayCollection.length-1].push(optionItem);
               }
            }else{
              arrAdd=[];
              if(Number(option.grossPremium.split("PLN ")[1]>0) || this.checkPersOfferSec(option)){
                
                //Added for total calculation
                this.getTotal(optionItem);
                optionItem.grossPremium = Number(optionItem.grossPremium.split("PLN ")[1]) > 0 ? (optionItem.grossPremium) : "";
                  arrAdd.push(optionItem);
                this.yourChoiceArrayCollection.push(arrAdd);
              }
            }            
          }
      }

  checkPersOfferSec(option:any): boolean  {
    for(let i=0;i<this.personalizedArr.length;i++){
      for(let j=0;j<this.personalizedArr[i].length;j++){
        if(this.personalizedArr[i][j].self == option.self){
          if(this.personalizedArr[i][j].selGroup == true){
            return true;
          }else {
            return false;
          }
        }
      }
    }
  }
  getTotal(optionItem){
    //Added for total calculation  
        var optionItemGross= optionItem.grossPremium;
        var splitAmount=optionItemGross.split(" ");
        optionItemGross= splitAmount[1];
        this.finalAmount= Number(optionItemGross) + this.finalAmount;
        let roundAmt= this.finalAmount.toFixed(2) + ' ' + this.curencyVar;
        let roundAmt2=this.finalAmount.toFixed(2)/2 + ' ' + this.curencyVar;
        this.totalAmount= roundAmt.replace(".", ",") ;
        this.totalAmount = this.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        this.totalAmount2 = roundAmt2.replace(".", ",");
        this.totalAmount2 = this.totalAmount2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');                
  }
  //Total recalculation on select of radio buttons
  adjustTotal(previousSelectedOpt, optionModel){
        var optionItemGrossPrev = previousSelectedOpt.grossPremium;
        var optionItemGrossCurr =  optionModel.grossPremium;
        var splitAmountPrev = optionItemGrossPrev.split(" ");
        var splitAmountCurr = optionItemGrossCurr.split(" ");
        optionItemGrossPrev = splitAmountPrev[1];
        optionItemGrossCurr = splitAmountCurr[1];
        this.finalAmount= this.finalAmount - Number(optionItemGrossPrev) + Number(optionItemGrossCurr);
        let roundAmt= this.finalAmount.toFixed(2) + ' ' + this.curencyVar;
        let roundAmt2=this.finalAmount.toFixed(2)/2 + ' ' + this.curencyVar;
        this.totalAmount= roundAmt.replace(".", ",") ;
        this.totalAmount = this.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        this.totalAmount2 = roundAmt2.replace(".", ",");
        this.totalAmount2 = this.totalAmount2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
    
  /* Below code is common code for taking price for option in personalized insurance offer for you*/
  getOptionPrice(optionsItem: any):void
  {

        for(let coveragePremium of this.configurationData.premium.coveragePremium)
        {
              for(let coverageItemPremium of coveragePremium.coverageItemPremium )
              {
                if (coverageItemPremium.coverageItemLink== optionsItem.self)
                {
                  optionsItem.grossPremium=coverageItemPremium.grossPremium;
                }
                    
                if(coverageItemPremium.hasOwnProperty("subCoverageItemPremiums"))
                for(let subCoverageItemPremium of coverageItemPremium.subCoverageItemPremiums)
                    {
                        if(subCoverageItemPremium.hasOwnProperty("subCoverageItemPremiums"))
                        for(let coverageItemPremiumObj of subCoverageItemPremium.subCoverageItemPremiums)
                        {
                            if (coverageItemPremiumObj.coverageItemLink== optionsItem.self)
                              {
                                optionsItem.grossPremium=coverageItemPremiumObj.grossPremium;
                              }
                        }
                        
                    }
              }
        
        }
  }

  /* Below code is used for selection/unselection of personalized insurance and reflect it corresponding value in Your choice*/

  selectOption(optionModel:any,personalizedModel:any, in1:any)
{

  var optionModelPresent:boolean=false;
  var previousSelectedOpt;
  for(let optionItem of personalizedModel)
  {
    if(optionItem.selection.selected)
    {
      previousSelectedOpt=optionItem;
      optionItem.selection.selected=false;
     // break;
    }
    if(optionItem.self==optionModel.self)
    {
        optionItem.selection.selected=true;
    }

  }
  if(previousSelectedOpt == undefined){
    previousSelectedOpt = optionModel;
  }

  for(let i=0;i<this.yourChoiceArrayCollection.length;i++)
    {
      
      if(this.yourChoiceArrayCollection[i].length < 2){
        if(previousSelectedOpt.self==this.yourChoiceArrayCollection[i][0].self){
          //Total recalculation
            this.adjustTotal(previousSelectedOpt, optionModel);
          if(Number(optionModel.grossPremium.split("PLN ")[1]) > 0 || optionModel.selGroup == true){
            this.yourChoiceArrayCollection[i][0].self=optionModel.self;
            this.yourChoiceArrayCollection[i][0].name=optionModel.name;
            this.yourChoiceArrayCollection[i][0].grossPremium=Number(optionModel.grossPremium.split("PLN ")[1]) > 0 ? (optionModel.grossPremium) : "";
            this.yourChoiceArrayCollection[i][0].coverName = personalizedModel[0].coverName;
            this.yourChoiceArrayCollection[i][0].selection.selected = true;
            optionModelPresent = true;            
            return; 
          }else{
            this.yourChoiceArrayCollection.splice(i,1);            
            return;
          }          
        }
      }else{
        for(let j=0;j<this.yourChoiceArrayCollection[i].length;j++){
          if(previousSelectedOpt.self==this.yourChoiceArrayCollection[i][j].self){
            //Total recalculation
            this.adjustTotal(previousSelectedOpt, optionModel);
            if(Number(optionModel.grossPremium.split("PLN ")[1]) > 0 || optionModel.selGroup == true){
              this.yourChoiceArrayCollection[i][j].self = optionModel.self;
              this.yourChoiceArrayCollection[i][j].name = optionModel.name;
              this.yourChoiceArrayCollection[i][j].grossPremium = Number(optionModel.grossPremium.split("PLN ")[1]) > 0 ? (optionModel.grossPremium) : "";
              this.yourChoiceArrayCollection[i][j].coverName = personalizedModel[0].coverName;
              this.yourChoiceArrayCollection[i][j].selection.selected = true;
              optionModelPresent = true;
              return;
            }else{
              this.yourChoiceArrayCollection[i].splice(j,1);
              return;
            }            
          }
        }
      }
    }
    if(optionModelPresent == false){
      var arrAdd = [];    
      optionModel.coverName = personalizedModel[0].coverName;
      if(Number(optionModel.grossPremium.split("PLN ")[1]) > 0 || optionModel.selGroup == true){
        arrAdd.push(JSON.parse(JSON.stringify(optionModel)));
        //Added for total calculation
        this.getTotal(optionModel);
        optionModel.grossPremium = Number(optionModel.grossPremium.split("PLN ")[1]) > 0 ? (optionModel.grossPremium) : "";
        this.yourChoiceArrayCollection.splice(this.getYourChoiceIndex(optionModel, in1)+1,0,arrAdd);
      }      
    }  
}  

 getYourChoiceIndex(optionModel, in1):any {
   var yourChoiceIndex = 0;
   if(in1 > 0 ){
     for(let i=in1-1;i>=0;i--){
       if(this.checkYourChoiceIndex(this.personalizedArr[i][0].coverName) > (-1)){
          yourChoiceIndex = this.checkYourChoiceIndex(this.personalizedArr[i][0].coverName);
          return yourChoiceIndex; 
       }      
     }
     return yourChoiceIndex;
   }else {
     return yourChoiceIndex;
   }
 }
 checkYourChoiceIndex(coverName):any {
  for(let i=0;i<this.yourChoiceArrayCollection.length;i++){
    if(coverName == this.yourChoiceArrayCollection[i][0].coverName){ 
      return i;
    }
  }
  return -1;
 }
  showDiscountOptions() {
    this.discOptions.nativeElement.classList.remove("is-not-visible");
    this.discOptions.nativeElement.classList.add("is-visible");
  }
  selectDiscountOption(data: any) {
    this.selectedDiscountOpt = data;
    this.discOptions.nativeElement.classList.remove("is-visible");
    this.discOptions.nativeElement.classList.add("is-not-visible");
    event.stopPropagation();
  }
  hideDDDiscountOptions() {
    this.discOptions.nativeElement.classList.remove("is-visible");
    this.discOptions.nativeElement.classList.add("is-not-visible");
  }

  getContractId() {
    if (JSON.parse(sessionStorage.getItem('Application')) !== null) {
        this.contractId = JSON.parse(sessionStorage.getItem('Application')).contractId;
        return this.contractId;
    } else {
        return this.contractId;
    }
}
getPolicyId() {
    if (JSON.parse(sessionStorage.getItem('productBundleData')) !== null) {
        this.policyId = JSON.parse(sessionStorage.getItem('productBundleData')).policyId;
        return this.policyId;
    } else {
        return this.policyId;
    }
}



serializeInstallmentTypeData(data) {
  this.installmentModel = data.options;
  this.installmentType = [];
  let installmentTypeObj: any;
  for (let i = 0; i < this.installmentModel.length; i++) {
    this.installmentType.push(this.installmentModel[i].label);
    this.installmentTypeMap[this.installmentModel[i].label] = this.installmentModel[i].value;
    if (this.sessionData && !installmentTypeObj) {      
      installmentTypeObj = this.sessionData.installmentType.value == this.installmentModel[i].value ? this.installmentModel[i] : false;
    }
  }
  if (this.sessionData) {
    this.selectedInstallment = installmentTypeObj;
  }

  this.isInstallmentTypeSuccess = true;
  if(this.isPaymentTypeSuccess){
    this.updateConfigOnRestore();
  }
}
 serializePaymentTypeData(data) {
   this.paymentTypeModel = data.options;
   this.paymentType = [];
   let paymentTypeObj: any;
   for (let i = 0; i < this.paymentTypeModel.length; i++) {
     this.paymentType.push(this.paymentTypeModel[i].label);
     this.paymentTypeMap[this.paymentTypeModel[i].label] = this.paymentTypeModel[i].value;
     if (this.sessionData && !paymentTypeObj) {       
       paymentTypeObj = this.sessionData.paymentType.value == this.paymentTypeModel[i].value ? this.paymentTypeModel[i] : false;
     }
   }
   if (this.sessionData) {
     this.selectedPaymentType = paymentTypeObj;
   }
   this.isPaymentTypeSuccess = true;
   if(this.isInstallmentTypeSuccess){
     this.updateConfigOnRestore();
   }
 }   
   addPaymentFrequencyJson(option, onRestore){
    this.installmentType=[];
     for(let i=0;i<this.installmentModel.length;i++){
        if(option.value =='ANNUAL'){
           this.configurationData.policyDetail['paymentFrequency']="ANNUAL"; 
        }else if(option.value =='SEMI_ANNUAL'){
           this.configurationData.policyDetail['paymentFrequency']="SEMI_ANNUAL"; 
        }
     }
        this.selectedInstallment=option;
        if(onRestore){
          this.addRemoveExtEntityJson(this.selectedPaymentType);
        }else {
          this.updatePaymentDetails();
        }        
   }

addRemoveExtEntityJson(option){
      this.paymentType=[];
       for(let i=0;i<this.paymentTypeModel.length;i++){
          if(option.value == "BANK_TRANSFER"){        
            delete this.configurationData.paymentData.extEntity;
           }else if(option.value == "ONLINE_PAYMENT"){
               if(this.configurationData.paymentData.extEntity  == undefined ){
                    this.configurationData.paymentData['extEntity'] =  {
                     "eClass" : "http://allianz.com/com.allianz.cisl.ext.extpayment#//ExtOnlinePayment"                    
               }
           }
       } 
   }
    // put call for configuration personalize section data
    this.selectedPaymentType=option;
    this.updatePaymentDetails();
 }
 updatePaymentDetails(){
     this.getContractId();
     this.getPolicyId();
     this.totalAmount =this.totalAmount2='';
     this.finalAmount=0;
     this.yourChoiceArrayCollection = [];
     this.personalizedArr = [];
     this.cislService.updateConfigurationDetails(this.configurationData,this.contractId, this.policyId).subscribe(data => { this.serializeConfigurationUpdateData(data); });
 }
 serializeConfigurationUpdateData(data:any){
  this.serializeUpSellOffer(data);
 }

  checkPremium(option){
  this.selectedInstallment = option;
      if(option == 'ANNUAL'){
     }else if (option == 'SEMI_ANNUAL') {
         let replaceValue=Number(this.totalAmount.split(" ")[0].replace(',','.'));
          this.totalAmount2 =  replaceValue/2;
          this.totalAmount2=this.totalAmount2 +' '+  this.curencyVar;
          this.totalAmount2= this.totalAmount2.replace('.',',');          
         
      }   

        	 		/* ********************DO-NOT-TOUCH***************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.quoteData.paymentData.paymentFrequency', this.selectedInstallment);
          
		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */
}

saveConfigurationData() {
    let dataObj = {
     "installmentType":this.selectedInstallment, 
     "paymentType":this.selectedPaymentType,
     "carVal":this.carValue,
     "configData" : this.configurationData,
     "premiumAmount" : this.totalAmount,
     "selectedPolicyId" : this.policyId,
     "totalAmount2" : this.totalAmount2
    };
    sessionStorage.setItem('configData', JSON.stringify(dataObj));
    sessionStorage.setItem('Application', JSON.stringify(this.applicationData));
  }

  getSessionData() {
   this.applicationData = JSON.parse(sessionStorage.getItem("Application"));
   this.sessionData = JSON.parse(sessionStorage.getItem("configData"));
   this.propertyId = this.applicationData.propertyId;
   if(this.sessionData && this.sessionData.selectedPolicyId == this.policyId){
    this.carValue =  this.sessionData.carVal;
    this.configurationData = this.sessionData.configData;    
    this.cislService.getPaymentServicesInstallmentType(this.contractId, this.policyId).subscribe(data => this.serializeInstallmentTypeData(data));
    this.cislService.getPaymentServicesPaymentType(this.contractId, this.policyId).subscribe(data => this.serializePaymentTypeData(data));
    this.serializeUpSellOffer(this.configurationData);
   } else {
    if(this.sessionData != null){
      if(this.sessionData.selectedPolicyId !== this.policyId){
        sessionStorage.removeItem("configData");
        this.sessionData = null;
       }
    }     
     this.getInitialData();
   }
  }
  
  private updateConfigOnRestore(){
    if(this.applicationData.isFromRestore && !this.isUpdateConfigOnRestoreCalled && this.sessionData.selectedPolicyId){
      this.applicationData.isFromRestore = false;
      this.isUpdateConfigOnRestoreCalled = true;      
      this.addPaymentFrequencyJson(this.selectedInstallment, true);   
    }
    

  }
  
}