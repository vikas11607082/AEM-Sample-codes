import { Component, Renderer, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CustomUrlSerializer } from '../../commons/customurl/customUrlSerializer';
import { CislService } from '../../util/util.cisl.service';
import { ErrorPopUp } from '../../commons/popup/popup.component';
import { CallPopUp } from '../../commons/popup/callcenterpopup.component';
import { SaveQuoteService } from '../../savequote/quote.save.service';
import { SaveButtonHideShowService } from '../../savequote/save.button.hide.show.service';
import { AEMSet, AEMTrack,AEMClearVars } from '../../commons/analytics';


declare var window: any;
@Component({
  templateUrl: '../html/quote.productbundle.component.html',
  entryComponents: [ErrorPopUp, CallPopUp]
})


export class ProductBundleComponent implements OnInit {

  constructor(private renderer: Renderer,
    private cislService: CislService,
    private router: Router,  private saveQuoteService:SaveQuoteService,private _saveButtonShowHide:SaveButtonHideShowService) { }
    	

  public carProtectionRef;
  public personalProtectionRef;
  public yourAssistanceRef;
  public yourAssistanceProtectionRef;

  public offOnNewPoliciesOnline: string = '15';

  public productOfferingData = [];
  //Offer value texts
  public basicCoverActual = "630 zł";
  public basicCoverOffered = "559 zł";

  public optimalCoverActual = "759 zł";
  public optimalCoverOffered = "680 zł";

  public maximumCoverActual = "859 zł";
  public maximumCoverOffered = "730 zł";

  public basicCoverData;
  public optimalCoverData;
  public maximumCoverData;

  public productBulndleArr = [];
  public policiesOffered = [];

  public contractId = "";

  public tablesArray = [];
  public policies = { 'basic': '1', 'optimal': '2', 'maximum': '3' };

  public showBackendError: boolean = false;
  public showCallCenterError: boolean = false;  

  public productData : any;
  public originalTableHeader:any;
  public buttonsContainer:any;

  public consentsArr = [];
  public selectedAllConsent: boolean;
  public isMarketingConsentChecked:boolean =  true;
  public consentsId = 'AZONLINE_PRODUCTBUNDLE';
  public questionCatelogueId:String = '';

  public noOfColoums:number = 0;
  private currentPageId = 5;
  private applicationData:any;
  private selectedBundleId:String = '';
  private selectedPolicyId:string = '';
  private selectedBundleName:string = '';
  
  ngOnInit() {    
    this.getContractId();
    this.getSessionData();
    /* Save Quote Listener function*/
    this._saveButtonShowHide.showQuoteId();
    this._saveButtonShowHide.showSaveButton();
    this.addSaveQuoteListener();   

     /*code to get current pageName and pageID and send it to adobe analytics*/

       var path = window.location.href;
       var pageData=path.split("#/");
       var currentPageName=pageData[1];
      
     

     if (currentPageName=="productbundle")
    {
	   var pageName= "Product Bundles";
     var pageID="car/S5productbundles:Step5";
    
   	 		/* ********************DO-NOT-TOUCH***************************************** */
      /* Clear eVars variables from the data layer on change of page view */
			 
			 AEMClearVars();

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.spapageview', pageName);
               AEMTrack('spapageview');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */
     } //end if condition
  
	 /*code to get current pageName and pageID and send it to adobe analytics end here*/



  }

  private addSaveQuoteListener(): void {
    this.saveQuoteService.currentPageId = this.currentPageId;
    this.saveQuoteService.SaveQuote.subscribe(() => {
      if (this.saveQuoteService.currentPageId == this.currentPageId) {
        this.applicationData = JSON.parse(sessionStorage.getItem('Application'));
        this.savePageData();
      }

    });
  }

  getSessionData(){
    this.productData = JSON.parse(sessionStorage.getItem("productBundleData"));   
    if(this.productData){
      this.selectedBundleId = this.productData.selectedBundleId;
      this.selectedPolicyId = this.productData.policyId;
      this.serializeProductOfferingData(this.productData.productData);        
      if(this.productData.questionCatelogueId){
        this.consentsArr = this.productData.consents;
        this.questionCatelogueId = this.productData.questionCatelogueId;
        this.selectedAllConsent = this.productData.selectedAllConsent;
      } else {
        this.getMarketingConsentsFromCisl();
      }      
    }
    
  }


  getContractId() {
    if (JSON.parse(sessionStorage.getItem('Application')) !== null) {
      this.contractId = JSON.parse(sessionStorage.getItem('Application')).contractId;
      return this.contractId
    } else {
      return this.contractId;
    }
  }

  createDataRow3Obj() {
    let dataObj;
    let index = this.productOfferingData.length;
    this.noOfColoums = index;
      dataObj = {
        'dataRow': index, 'heading': '', 'subheading': '', 'basiccover': false, 'optimalcover': false, 'maximumcover': false,
        'coversubheading': '', 'optimalcoversubheading': '', 'maximumcoverheading': '',
        'basicovercontent': '', 'optimalcovercontent': '', 'maximumcovercontent': ''
      };    
   
    return dataObj;
  }

  createTableArrayObj() {
    let tableObj = { 'tableHeading': '', 'tableDescription': '', 'tableItems': [] };
    return tableObj;
  }

  clickCollapsable(event, ele) {
    event.stopPropagation();
    if (ele.classList.contains('is-collapse')) {
      ele.classList.remove('is-collapse');
    } else {
      ele.classList.add('is-collapse');
    }
  }


  assignPremiumData(data, type) {
    let dataObj: any;
    if (type == 'basic') {
      dataObj = this.returnPrmiumValues(data);
      this.basicCoverActual = dataObj.grossPremium.replace('.',',') + ' zł';
      this.basicCoverOffered = dataObj.netPremium.replace('.',',') + ' zł';
      this.basicCoverActual = this.basicCoverActual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      this.basicCoverOffered = this.basicCoverOffered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    } else if (type == "optimal") {
      dataObj = this.returnPrmiumValues(data);      
      this.optimalCoverActual = dataObj.grossPremium.replace('.',',') + ' zł';
      this.optimalCoverOffered = dataObj.netPremium.replace('.',',') + ' zł';
      this.optimalCoverActual = this.optimalCoverActual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      this.optimalCoverOffered = this.optimalCoverOffered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');


    } else if (type == "maximum") {
      dataObj = this.returnPrmiumValues(data);
      this.maximumCoverActual = dataObj.grossPremium.replace('.',',') + ' zł';
      this.maximumCoverOffered = dataObj.netPremium.replace('.',',') + ' zł';
       this.maximumCoverActual = this.maximumCoverActual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      this.maximumCoverOffered = this.maximumCoverOffered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
  }

  returnPrmiumValues(data): any {
    let obj = { 'grossPremium': '', 'netPremium': '' }
    let grossPrmStr = data.grossPremium.split(' ');
    let disPrmStr = data.totalDiscount.split(' ');
    let grossPremium;
    let discount;
    let netPremium
    
    if(disPrmStr[1] == "0.00" || disPrmStr[1] == "00.00" || disPrmStr[1] == "00.0" || disPrmStr[1] == "0.0"){
      grossPremium = grossPrmStr[1];
      netPremium = grossPrmStr[1];
    } else {
      grossPremium = grossPrmStr[1];
      discount = disPrmStr[1];  
      netPremium = grossPremium - discount;
    }
    
    let _grossVal =  Number(grossPremium).toFixed(2);
    let _netVal = Number(netPremium).toFixed(2);
    obj.grossPremium = _grossVal;
    obj.netPremium = _netVal;

    return obj;

  }

  assignAllCoverData() {
    if (this.maximumCoverData && this.optimalCoverData && this.basicCoverData) {
      this.mapCoverData(this.basicCoverData, this.optimalCoverData, this.maximumCoverData);
    } else if (this.optimalCoverData && this.basicCoverData) {
      this.mapCoverData(this.basicCoverData, this.optimalCoverData);
    } else if (this.basicCoverData && this.maximumCoverData) {
      this.mapCoverData(this.basicCoverData, this.maximumCoverData);
    } else if (this.optimalCoverData && this.maximumCoverData) {
      this.mapCoverData(this.optimalCoverData, this.maximumCoverData);
    } else if (this.basicCoverData) {
      this.mapCoverData(this.basicCoverData );
    } else if (this.optimalCoverData) {
      this.mapCoverData(this.optimalCoverData );
    } else if (this.maximumCoverData) {
      this.mapCoverData(this.maximumCoverData );
    }
  }

  mapCoverData(...args: any[]) {
    let maxTables = 5;
    let maxCoverages = this.getMaxCoverage(args);
    let maxCoverageCount = maxCoverages.highestCount;
    let maxCoveragesObj = maxCoverages.hightestCountObj;
    let basic;
    let optimal;
    let maximum;

    let testObj = [];

    if (args.length == 3) {
      basic = args[0].coverages;
      optimal = args[1].coverages;
      maximum = args[2].coverages;
    } else if (args.length == 2) {
      basic = args[0].coverages;
      optimal = args[1].coverages;
    } else {
      basic = args[0].coverages;
    }

    for (let i = 0; i < maxCoverageCount; i++) {
      let tableObj = this.createTableArrayObj();
      tableObj.tableHeading = maxCoveragesObj[i].description;
      //tableObj.tableDescription = maxCoveragesObj[i].description;
      let coverage = maxCoveragesObj[i].name;
      if (maximum) {
        let maxCoverageItems = maxCoveragesObj[i].coverageItems;
        let basicCoverageItems;
        let optimalCoverageItems;
        let maximumCoverageItems
        if(basic[i] && basic[i].name == coverage){
          basicCoverageItems = basic[i].coverageItems;
        }
        if(optimal[i] && optimal[i].name == coverage){
          optimalCoverageItems = optimal[i].coverageItems;
        }
        if(maximum[i] && maximum[i].name == coverage){
          maximumCoverageItems = maximum[i].coverageItems;
        }        
        
        maxCoverageItems = this.returnCoverageItem(maxCoverageItems);
        basicCoverageItems = this.returnCoverageItem(basicCoverageItems);
        optimalCoverageItems = this.returnCoverageItem(optimalCoverageItems);
        maximumCoverageItems = this.returnCoverageItem(maximumCoverageItems);

        if (maxCoverageItems[0].subCoverageItems || basicCoverageItems[0].subCoverageItems
          || optimalCoverageItems[0].subCoverageItems || maximumCoverageItems[0].subCoverageItems) {
          let maxCoverageSubItems
          if (maxCoverageItems[0].subCoverageItems) {
            maxCoverageSubItems = JSON.parse(JSON.stringify(maxCoverageItems[0].subCoverageItems));
            this.checkCoveraIsAvailable(maxCoverageSubItems, basicCoverageItems[0].subCoverageItems, optimalCoverageItems[0].subCoverageItems, maxCoverageItems[0].subCoverageItems);
          }
        }
      if(maxCoverageItems) {
          this.createCoverRowObjects(maxCoverageItems, maximumCoverageItems, basic, optimal, maximum, tableObj, coverage);
        }
      } else if (optimal) {
        let maxCoverageItems = maxCoveragesObj[i].coverageItems;
        let basicCoverageItems;
        let optimalCoverageItems;       
        if(basic[i] && basic[i].name == coverage){
          basicCoverageItems = basic[i].coverageItems;
        }
        if(optimal[i] && optimal[i].name == coverage){
          optimalCoverageItems = optimal[i].coverageItems;
        }
     
        maxCoverageItems = this.returnCoverageItem(maxCoverageItems);
        basicCoverageItems = this.returnCoverageItem(basicCoverageItems);
        optimalCoverageItems = this.returnCoverageItem(optimalCoverageItems);

        if (maxCoverageItems[0].subCoverageItems || basicCoverageItems[0].subCoverageItems
          || optimalCoverageItems[0].subCoverageItems) {
          let maxCoverageSubItems
          if (maxCoverageItems[0].subCoverageItems) {
            maxCoverageSubItems = JSON.parse(JSON.stringify(maxCoverageItems[0].subCoverageItems));
            this.checkCoveraIsAvailable(maxCoverageSubItems, basicCoverageItems[0].subCoverageItems, optimalCoverageItems[0].subCoverageItems, maxCoverageItems[0].subCoverageItems);
          } 
          
        }

        if (maxCoverageItems) {
          this.createCoverRowObjects(maxCoverageItems, false, basic, optimal, false, tableObj, coverage);
        }
      } else if (basic) {
        let maxCoverageItems = maxCoveragesObj[i].coverageItems;
        let basicCoverageItems;        
        if(basic[i] && basic[i].name == coverage){
          basicCoverageItems = basic[i].coverageItems;
        }
        
        maxCoverageItems = this.returnCoverageItem(maxCoverageItems);
        basicCoverageItems = this.returnCoverageItem(basicCoverageItems);

        if (maxCoverageItems[0].subCoverageItems || basicCoverageItems[0].subCoverageItems) {
          let maxCoverageSubItems
          if (maxCoverageItems[0].subCoverageItems) {
            maxCoverageSubItems = JSON.parse(JSON.stringify(maxCoverageItems[0].subCoverageItems));
            this.checkCoveraIsAvailable(maxCoverageSubItems, basicCoverageItems[0].subCoverageItems, undefined, maxCoverageItems[0].subCoverageItems);
          }
          
        }
        if (maxCoverageItems) {
          this.createCoverRowObjects(maxCoverageItems, false, basic, false, false, tableObj, coverage);
        }
      }
    }

  }

  returnCoverageItem(arr) {
    if (arr == undefined) {
      return [[]];
    } else {
      for(let i=0; i<arr.length; i++){
        if(arr[i].selection.selected == true){
          let temp = [];
          temp.push(arr[i]);
          return temp;
        }
      } 
      return [[]];     
    }
  }


  /* Creation of Cover object from data */
  createCoverRowObjects(maxCoverageItems, maximumCoverageItems, basic, optimal, maximum, tableObj, coverage) {
      let obj = this.createDataRow3Obj();
      let subCoveragesArr;
      obj.heading = coverage;
      /* Maxium Cover values assignment */      
      let maxCoverObj = this.findCoverItem(obj.heading, maximum);
      if (maxCoverObj) {
        obj.maximumcoverheading = maxCoverObj.name;
        obj.maximumcovercontent = maxCoverObj.description;
        obj.maximumcover = maxCoverObj.selection.selected;
        obj.maximumcovercontent = maxCoverObj.description;
      }
      /*Basic Cover values assignment */
      let basicCoverObj = this.findCoverItem(obj.heading, basic);
      if (basicCoverObj) {
        obj.coversubheading = basicCoverObj.name;
        obj.basicovercontent = basicCoverObj.description;
        obj.basiccover = basicCoverObj.selection.selected;
        obj.basicovercontent = basicCoverObj.description;
      }
      /*Optimal Cover values assignment */
      let optimalCoverObj = this.findCoverItem(obj.heading, optimal);
      if (optimal) {        
        if (optimalCoverObj) {
          obj.optimalcoversubheading = optimalCoverObj.name;
          obj.optimalcovercontent = optimalCoverObj.description;
          obj.optimalcover = optimalCoverObj.selection.selected;
          obj.optimalcovercontent = optimalCoverObj.description;
        }
      }

      


      /* Sub coverage assignement */
      for (let j = 0; j < maxCoverageItems.length; j++) {
        if (maxCoverageItems[j].subCoverageItems && maxCoverageItems[j].selection.selected) {
          subCoveragesArr = [];
          for (let sub = 0; sub < maxCoverageItems[j].subCoverageItems.length; sub++) {
            let subObj = this.createDataRow3Obj();
            let maxSubItemName = maxCoverageItems[j].subCoverageItems[sub].name;
            let maxSubItemSign = maxCoverageItems[j].subCoverageItems[sub].sign;
            /* basic cover sub cover assignment */
            let basicSubCoverObj = this.findSubCoverItem(obj.heading, basic, maxSubItemName, maxSubItemSign);
            let isBasicVariant = basicCoverObj ? basicCoverObj.selection.selected : false;
            if (basicSubCoverObj) {
              subObj.subheading = basicSubCoverObj.name;
              subObj.basiccover = basicSubCoverObj.selection.selected && isBasicVariant ? true:false;
              if (basicSubCoverObj.subCoverageItems) {
                subObj.coversubheading = this.findSubCoverDescription(basicSubCoverObj.subCoverageItems);
              }
            };

            /* optimal cover sub cover assignment */
            if (optimal) {
              let optimalSubCoverObj = this.findSubCoverItem(obj.heading, optimal, maxSubItemName, maxSubItemSign);
              let isOptimalVariant = optimalCoverObj ? optimalCoverObj.selection.selected : false
              if (optimalSubCoverObj) {
                subObj.subheading = optimalSubCoverObj.name;
                subObj.optimalcover = optimalSubCoverObj.selection.selected && isOptimalVariant ? true:false;
                if (optimalSubCoverObj.subCoverageItems) {
                  subObj.optimalcoversubheading = this.findSubCoverDescription(optimalSubCoverObj.subCoverageItems);
                }
              }
            }

            /* maximum cover sub cover assignment */
            if (maximum) {
              let maxiSubCoverObj = this.findSubCoverItem(obj.heading, maximum, maxSubItemName, maxSubItemSign);
              let isMaximumVariant = maxCoverObj ? maxCoverObj.selection.selected : false;
              if (maxiSubCoverObj) {
                subObj.subheading = maxiSubCoverObj.name;
                subObj.maximumcover = maxiSubCoverObj.selection.selected && isMaximumVariant ? true:false;;
                if (maxiSubCoverObj.subCoverageItems) {
                  subObj.maximumcoverheading = this.findSubCoverDescription(maxiSubCoverObj.subCoverageItems);
                }
              }
            }
            subCoveragesArr.push(subObj);
          }
        }
      }
      tableObj.tableItems.push(obj);
      if (subCoveragesArr) {
        for (let sub = 0; sub < subCoveragesArr.length; sub++) {
          tableObj.tableItems.push(subCoveragesArr[sub]);
        }
      }
    //}
    this.tablesArray.push(tableObj);
  }

  findSubCoverDescription(subcover): string {
    let str = '';
    for (let i = 0; i < subcover.length; i++) {
      if (subcover[i].selection.selected) {
        if (str !== '') {
          str = str + ', '
        }
        str = str + subcover[i].name;
      }
    }
    return str;
  }

  findCoverItem(coverName, coverages) {
    for (let i = 0; i < coverages.length; i++) {
      if (coverages[i].coverageItems && coverages[i].name == coverName) {
        for (let j = 0; j < coverages[i].coverageItems.length; j++) {          
            if (coverages[i].coverageItems[j].selection.selected) {
              return coverages[i].coverageItems[j];
            }          
        }
      }
    }
    return false;
  }

  findSubCoverItem(coverName, coverages, name, sign) {
    for (let i = 0; i < coverages.length; i++) {
      if (coverages[i].coverageItems && coverages[i].name == coverName) {
        for (let j = 0; j < coverages[i].coverageItems.length; j++) {
          if (coverages[i].coverageItems[j].subCoverageItems && coverages[i].coverageItems[j].selection.selected == true) {
            for (let subItem = 0; subItem < coverages[i].coverageItems[j].subCoverageItems.length; subItem++) {
              if (coverages[i].coverageItems[j].subCoverageItems[subItem].name == name && coverages[i].coverageItems[j].subCoverageItems[subItem].sign == sign) {
                return coverages[i].coverageItems[j].subCoverageItems[subItem];
              }
            }
          }
        }
      }
    }
    return false;
  }

  getMaxCoverage(args) {
    let lengthArr = [];
    let highestCount = 0;
    let hightestCountObj;
    let namesArr = args[3];
    for (let i = 0; i < args.length; i++) {
      if (highestCount <= args[i].coverages.length) {
        highestCount = args[i].coverages.length;
        hightestCountObj = args[i].coverages;
      }
    }
    return { 'highestCount': highestCount, 'hightestCountObj': hightestCountObj };

  }

  // CISL call for Offerings, Coverages and Premium.

  // getProductOfferings(params) {
  //   this.cislService.getProductOffers(params).subscribe(data =>  this.serializeProductOfferingData(data));           
  // }

  checkCoveraIsAvailable(targetArr, loopArr1, loopArr2, dataArr) {
    let tempCoveObj = {
      "name": "",
      "eClass": "http://allianz.com/com.allianz.cisl.core.policy#//Coverage", "selection": {
        "eClass": "http://allianz.com/com.allianz.cisl.base.selection#//Selection",
        "selected": false,
        "editable": false
      }
    };

    if (loopArr1 == undefined && loopArr2 == undefined) {
      return dataArr;
    }
    let loopArray = loopArr1 == undefined ? loopArr2 : loopArr1;
    let isArray
    for (let i = 0; i < loopArray.length; i++) {
      let isCoverPresent = true;
      let filterName = '';
      let loopFilterName = '';

      if (loopArr1) {

        for (let j = 0; j < loopArr1.length; j++) {
          loopFilterName = loopArr1[i].name;
          if (targetArr[j] == undefined) {
            isCoverPresent = false;
            break;
          }
          if (loopArr1[i].name !== targetArr[j].name) {
            isCoverPresent = false;
            filterName = targetArr[j].name;
          } else {
            isCoverPresent = true;
            break;
          }
        }
        if (!isCoverPresent) {
          tempCoveObj.name = loopArr1[i].name;
          dataArr.splice(i, 0, tempCoveObj);
          if (dataArr.length == loopArr1.length) {
            return dataArr;
          }
        }

      }

      if (loopArr2) {
        let isCoverPresent1 = true;

        if (filterName == '') {
          for (let j = 0; j < loopArr2.length; j++) {
            if (targetArr[j] == undefined) {
              isCoverPresent1 = false;
              break;
            }
            if (loopFilterName == loopArr2[i].name) {
              isCoverPresent1 = true;
              break;
            }
            if (loopArr2[i].name !== targetArr[j].name) {
              isCoverPresent1 = false;
            } else {
              isCoverPresent1 = true;
              break;
            }
          }
          if (!isCoverPresent1) {
            tempCoveObj.name = loopArr1[i].name;
            dataArr.splice(i, 0, tempCoveObj);
            if (dataArr.length == loopArr2.length) {
              return dataArr;
            }
          }
        }

      }
    }
    return dataArr;
  }

  serializeProductOfferingData(data) {
    let tempArr = []
    for (let i = 0; i < data.offerings.length; i++) {
      let obj = { "name": "", "policy": "", "id":"" };
      let offerings = data.offerings[i].offeringData;
      if (offerings.bundleId == "MIN") {
        // Offerings
        obj.name = offerings.bundleName;
        obj.policy = offerings.policyId;
        obj.id = offerings.bundleId;
        this.productOfferingData[0] = obj;
        // Coverdata
        this.basicCoverData = offerings.policy;
        this.policies.basic = offerings.policyId;
        // Premium
        this.assignPremiumData(offerings.policyPremium, 'basic');
      } else if (offerings.bundleId == "OPT") {
        // Offerings
        obj.name = offerings.bundleName;
        obj.policy = offerings.policyId;
        obj.id = offerings.bundleId;
        this.productOfferingData[1] = obj;
        // Coverdata
        this.optimalCoverData = offerings.policy;
        this.policies.optimal = offerings.policyId;
        // Premium
        this.assignPremiumData(offerings.policyPremium, 'optimal');
      } else if (offerings.bundleId == "MAX") {
        // Offerings
        obj.name = offerings.bundleName;
        obj.policy = offerings.policyId;
        obj.id = offerings.bundleId;
        this.productOfferingData[2] = obj;
        // Coverdata
        this.maximumCoverData = offerings.policy;
        this.policies.maximum = offerings.policyId;
        // Premium
        this.assignPremiumData(offerings.policyPremium, 'maximum');
      }
    }

    for (let index = 0; index<this.productOfferingData.length; index++){
      if(this.productOfferingData[index] == undefined){
        this.productOfferingData.splice(index, 1);
      }
    }
    this.assignAllCoverData();
    window.scrollTo(0, 0);
  }

  closeErrorPopup(data) {
    this.showBackendError = false;
  }

  closeCallCenterPopup(data) {
    this.showCallCenterError = false;
  }

  navigateToCustomize(event, type, selectedId, bundleName) {
    let policyId = this.policies[type];
    this.selectedBundleId = selectedId;
    this.selectedBundleName = bundleName;
    this.cislService.postSelectPolicy(policyId).subscribe(data => this.postSelectedPolicy(data, policyId));

     	 		/* ********************DO-NOT-TOUCH***************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.quoteData.productBundleData.selectedProductBundleName', this.selectedBundleName);


		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */

      }

  postSelectedPolicy(data, policyId) {
    this.selectedPolicyId = policyId;    
    this.saveQuoteService.autoSavePageData();
    this.navigateToNextPage();
  }

  savePageData(){
    let dataObj = {
      "policyId": this.selectedPolicyId,
      "selectedBundleId":this.selectedBundleId,
      "productData": this.productData.productData,
      "questionCatelogueId": this.questionCatelogueId,
      "consents":this.consentsArr,
      "selectedAllConsent": this.selectedAllConsent,
      "selectedBundleName" : this.selectedBundleName};
    this.applicationData.currentPageId = this.saveQuoteService.currentPageId;
    sessionStorage.setItem("Application", JSON.stringify(this.applicationData));
    sessionStorage.setItem('productBundleData', JSON.stringify(dataObj));    
    
  }

  navigateToNextPage(){
    this.router.navigateByUrl('/configuration');
  }

   /* Marketing consents */
   getMarketingConsentsFromCisl(){
    this.cislService.getMarketingConsentsFromCisl(this.contractId,this.consentsId).subscribe(data => {this.serializeMarketingConsents(data)});
  }

  serializeMarketingConsents(data){
    this.questionCatelogueId = data[0].questionsCatalogueId;
    this.consentsArr = data[0].decisionQuestion;
  }
  setConsents(data) {		
		this.isMarketingConsentChecked = !(data.IsConsentValid);
    this.selectedAllConsent = data.SelectedAllConsents;	
    this.consentsArr = data.ConsentArray;	
  }
  
  sendMarketingConsentToCisl(){
    this.cislService.sendMarketingConsentsToCisl(this.contractId,this.questionCatelogueId,this.consentsArr).subscribe(data => {console.log(data)});
  }
  clickBackButton() {
    this.saveQuoteService.autoSavePageData();
    this.router.navigateByUrl('/driverdetails');
  }


}