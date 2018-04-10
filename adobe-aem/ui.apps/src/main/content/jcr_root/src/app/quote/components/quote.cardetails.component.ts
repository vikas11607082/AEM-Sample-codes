import { Component, Renderer, ViewChild, ElementRef, AfterViewInit, OnInit, Inject } from '@angular/core';
import { TranslateService } from '../../commons/translate';
import { CislService } from '../../util/util.cisl.service';
import { Router, NavigationEnd } from '@angular/router';
import { DispatcherService } from '../../commons/services/dispatcherservice';
import { CustomUrlSerializer } from '../../commons/customurl/customUrlSerializer';
import { ErrorPopUp } from '../../commons/popup/popup.component';
import { CallPopUp } from '../../commons/popup/callcenterpopup.component';
import { Constants } from '../../commons/constants';
import { SaveQuoteService } from '../../savequote/quote.save.service';
import { AEMSet, AEMTrack, AEMClearVars } from '../../commons/analytics';
import { SaveButtonHideShowService } from '../../savequote/save.button.hide.show.service';
import { UrlRetrieveServices } from '../../restorequote';
import { RestoreQuoteSessionService } from '../../restorequote/quote.restore.session';


declare var window: any;

@Component({
	templateUrl: '../html/quote.cardetails.component.html',
	entryComponents: [ErrorPopUp, CallPopUp]
})
export class CarDetailsComponent extends Constants implements OnInit {
	

	/*code added for progress bar starts*/
	@ViewChild('progressbarActive') progressbarActive: ElementRef
	@ViewChild('dropDownCarBrand') dropDownCarBrand: ElementRef
	@ViewChild('dropDownProdYear') dropDownProdYear: ElementRef
	@ViewChild('dropDownCarEngineSize') dropDownCarEngineSize: ElementRef
	@ViewChild('dropDownCarEnginePower') dropDownCarEnginePower: ElementRef
	@ViewChild('ddListEnginePower') ddListEnginePower: ElementRef
	@ViewChild('ddListEngineSize') ddListEngineSize: ElementRef
	@ViewChild('standardEquip') standardEquip: ElementRef
	@ViewChild('prodYearList') prodYearList: ElementRef


	/*code added for progress bar ends*/
	constructor(
		private restoreService: RestoreQuoteSessionService,
		private renderer: Renderer,
		private translate: TranslateService,
		private cislService: CislService,
		private router: Router,
		private dispatcher: DispatcherService,
		private saveQuoteService: SaveQuoteService,
		private _saveButtonShowHide: SaveButtonHideShowService,
		private urlRetrieveService: UrlRetrieveServices) {
		super(); // for Constants
	}

	carDetails: JSON;
	hasErrors: boolean = false;
	nextClicked: boolean = false;
	/*carBrand = Array<CarBrand>();*/
	showSelectPopup: boolean;
	toShowClass: string;
	carBrandClick: boolean;
	firstTimeCarBrandDDCall: boolean;
	firstTimeProdYearDDCall: boolean;
	firstTimeCarEngineSizeDDCall: boolean;
	firstTimeCarEnginePowerDDCall: boolean;
	showMoreStndEquip: boolean = false;
	//HideHrPopularCarBrandNull: boolean = true;

	carBrandClass: string = "c-poland-form-select js-poland-form-select u-margin-top-lg u-margin-bottom-lg c-poland-form-select--negative";
	carEngineSizeClass: string = "c-poland-form-select js-poland-form-select c-poland-form-select--pull-up";
	carEnginePowerClass: string = "c-poland-form-select js-poland-form-select c-poland-form-select--pull-up";
	bsJustifyCenter: string = "";
	vehicleCharData = [];

	public isNextDisable: boolean;

	showStandardEquip: boolean;
	showFuelType: boolean = false;
	showCarBody: boolean = false;
	showCarModel: boolean = false;
	carVersion: boolean;
	showCarVersion: boolean = false;
	showSideOfWheel: boolean = false;
	showNextButton: boolean = false;
	showCarVersionTable: boolean = false;
	showCarEngine: boolean = false;
	CarEnginePower: boolean = false;

	fuelType: string = '';
	carBody: string = '';
	carModel: string = '';
	carModelSelected: string = '';
	carVersionId: string = '';
	carVersionName: string = '';
	carDoors: string = '';
	standardEquipmentSelected: string = '';
	antiTheftSecurity: string = '';
	sideofWheelSelected: string = 'Left';
	standeredEquiData: any;

	/*Dynamically append bootstrap clss*/
	bsFuelType: string = "";
	bsCarBodyType: string = "";
	bsCarModelType: string = "";

	/* For Anti Theft check uncheck logic */
	modelImmobilize: boolean = false;
	modelAlarm: boolean = false;
	modelGearLock: boolean = false;
	modelGps: boolean = false;
	modelOther: boolean = false;
	flagTheft: boolean = true;
	optionSelected: boolean = false;
	deSelectedAllAnti: any;

	enableMoreStndEq: boolean = true;
	enableLessStndEq: boolean = false;

	/*Headings and PlaceHolders */
	carBrandEvent: any;

	carVersionSize = "";
	carModelDetail = "";

	selectedCarBrand = this.NO_VAL;
	selectedProdYear = this.NO_VAL;
	selectedCarEngineSize = this.NO_VAL;
	selectedCarEnginePower = this.NO_VAL;

	carBrandInputValue = '';
	prodYearInputValue = '';
	carEngineSizeInputValue = '';
	carEnginePowerInputValue = '';

	carBrandPopular = [];
	carBrandNonPoupular = [];
	showCarBrandPopular = this.carBrandPopular;
	showCarBrandNonPopular = this.carBrandNonPoupular;
	otherAntiTheftDesc: string;
	showOtherAntiTheftDesc: boolean;

	productionYears = [];
	prodYearEvent: any;
	showProdYear = this.productionYears;
	vehicleBrands: any;
	requestParams = '';
	exceptCatalogParams = '';
	requestKey = '';

	highlighted = 'c-table__row--highlighted';

	fuelTypes = [];
	carBodyTypes = [];
	carModels = [];
	antiTheftModels = [];
	carVersionModels = [];
	sideofWheelData = [];
	standardEquipmentModels = [];

	carEngineSize = [];
	showcarEngineSize = this.carEngineSize;
	carEnginePower = [];
	showcarEnginePower = this.carEnginePower;
	className = "c-icon c-icon--poland c-icon--poland--brand-";
	anthiTheftValues: string = '';

	public sortBy = "version";
	public sortOrder = "asc";
	private prvTableRow: any;

	public consentsArr = [];
	public selectedAllConsent: boolean;

	public isMarketingConsentChecked: boolean = true;
	public consentsId = 'AZONLINE_CARDETAILS';
	public questionCatelogueId: String = '';
	public contractId: string = '';
	public applicationSession: any;

	public isStdEquipment: boolean = false;

	private currentPageId: number = 1;
	private quoteId: string = "";
	public disabledNext: Boolean = false;

	ngOnInit(): void {
		if(sessionStorage.getItem("qb_uname") !== undefined && sessionStorage.getItem("qb_uname") !== null && sessionStorage.getItem("qb_uname") !== ''){
			this.restoreService.setCCUserNameHeader(sessionStorage.getItem("qb_uname"));
		}

		if((this.urlRetrieveService.getSalesChannel() == undefined || this.urlRetrieveService.getSalesChannel() == "") && 
			(sessionStorage.getItem("channel") != this.CC_CHANNEL) ){
			this.setHeaders();
		}
		/*code to get current pageName and pageID and send it to adobe analytics*/

		var path = window.location.href;
		var pageData = path.split("#/");
		var currentPageName = pageData[1];
	
		this.saveQuoteService.currentPageId = this.currentPageId;
		this.saveQuoteService.SaveQuote.subscribe(() => {
			if (this.saveQuoteService.currentPageId == this.currentPageId) {
				this.applicationSession = JSON.parse(sessionStorage.getItem("Application"));
				this.saveCarDetailsData();
			}
		});


		this._saveButtonShowHide.hideSaveButton();

		if (currentPageName == "cardetails") {
			var pageName = "Car Details";
			var pageID = "car/S1carDetails:Step1";

			/* ********************DO-NOT-TOUCH***************************************** */
			 /* Clear eVars variables from the data layer on change of page view */
			 
			 AEMClearVars();
			/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
			AEMSet('digitalData.quote.spapageview', pageName);
			AEMTrack('spapageview');

			/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

			/* ************************DO-NOT-TOUCH****************************************** */

		} //end if condition


		this.applicationSession = JSON.parse(sessionStorage.getItem("Application"));
		if (this.applicationSession == null || this.applicationSession == undefined) {
			this.cislService.getContractIdFromCisl().subscribe(data => { this.setContractId(data) });
		} else {
			if (this.applicationSession.contractId == undefined || this.applicationSession.contractId == null || this.applicationSession.contractId == '') {
				this.cislService.getContractIdFromCisl().subscribe(data => { this.setContractIdOnRetrieve(data) });
			} else {
				this.contractId = this.applicationSession.contractId;
				this.setProcess();
			}			
		}
		
	}
	setHeaders() {
		sessionStorage.setItem("channel",this.WEB_CHANNEL);
		sessionStorage.setItem("qb_ticket",null);
		sessionStorage.setItem("qb_uname",null);		
	}
	setProcess(){
			this.quoteId = this.applicationSession.quoteId;
			this._saveButtonShowHide.showQuoteId();
			this.isNextDisable = true;
			/* For translation in english by default on page load */
			this.translate.use("en");			
			this.cislService.getDataFromCislCarDetails(this.requestParams).subscribe(data => this.serializeCarBrandData(data));			
			let carDetailsData = JSON.parse(sessionStorage.getItem("carDetails"));
			if (carDetailsData != null) {
				if (carDetailsData.consentsArr.length > 0) {
					this.consentsArr = carDetailsData.consentsArr;
				} else {
					this.getMarketingConsentsFromCisl();
				}
				this.populateStoredData(carDetailsData);
			} else {
				this.getMarketingConsentsFromCisl();
			}
	}
	setContractIdOnRetrieve(data) {
		this.contractId = data;
		var applicationData = JSON.parse(sessionStorage.getItem("Application"));
		applicationData['contractId'] = this.contractId;
		sessionStorage.setItem("Application", JSON.stringify(applicationData));	
		this.setProcess();		
	}
	setContractId(data) {
		
		this.contractId = data;
		this.isNextDisable = true;
		/* For translation in english by default on page load */
		this.translate.use("en");
		this.cislService.getDataFromCislCarDetails(this.requestParams).subscribe(data => this.serializeCarBrandData(data));
		let carDetailsData = JSON.parse(sessionStorage.getItem("carDetails"));
		if (carDetailsData != null) {
			if (carDetailsData.consentsArr.length > 0) {
				this.consentsArr = carDetailsData.consentsArr;
			} else {
				this.getMarketingConsentsFromCisl();
			}
			this.populateStoredData(carDetailsData);
		} else {
			this.getMarketingConsentsFromCisl();
		}
		
	}
	addRemoveCarEngineSizeClasses() {
		if (this.selectedCarEngineSize == '' || this.selectedCarEngineSize == '__NO_VAL__') {
			this.carEngineSizeClass = "c-poland-form-select js-poland-form-select c-poland-form-select--pull-up";
		} else {
			this.carEngineSizeClass = "c-poland-form-select js-poland-form-select c-poland-form-select--pull-up is-filled";
		}
	}
	addRemoveCarEnginePowerClasses() {
		if (this.selectedCarEnginePower == '' || this.selectedCarEnginePower == '__NO_VAL__') {
			this.carEnginePowerClass = "c-poland-form-select js-poland-form-select c-poland-form-select--pull-up";
		} else {
			this.carEnginePowerClass = "c-poland-form-select js-poland-form-select c-poland-form-select--pull-up is-filled";
		}
	}
	populateStoredData(carDetailsData: any): void {
		//this.contractId = carDetailsData.contractId;
		this.questionCatelogueId = carDetailsData.questionCatelogueId;
		this.selectedAllConsent = carDetailsData.selectedAllConsent;
		this.selectedCarBrand = carDetailsData.carBrand;

		/*Start Car Engine Data*/
		this.selectedCarEngineSize = carDetailsData.carEngineSize;
		this.selectedCarEnginePower = carDetailsData.carEnginePower;


		/*End Car Engine Data*/

		this.selectedProdYear = carDetailsData.prodYear;
		this.requestParams = this.createRequestforCisl("vehicleBrand", this.selectedCarBrand.toUpperCase());
		this.cislService.getDataFromCislCarDetails(this.requestParams).subscribe(data => this.serializeProdYearData(data));

		/*Fuel Type Data*/
		this.fuelType = carDetailsData.fuelType;
		this.requestParams = this.createRequestforCisl("buildYear", this.selectedProdYear);
		this.cislService.getDataFromCislCarDetails(this.requestParams).subscribe(data => this.serializefuelTypeData(data, true));
		this.showFuelType = true;

		/*Car Body Data*/
		this.carBody = carDetailsData.carBody;
		this.requestParams = this.createRequestforCisl("fuelType", this.fuelType);
		this.cislService.getDataFromCislCarDetails(this.requestParams).subscribe(data => this.serializeCarBodyData(data, true));
		this.showCarBody = true;

		/*Car Model Data */
		this.carModelSelected = carDetailsData.carModel;
		this.requestParams = this.createRequestforCisl("bodyType", this.carBody);
		this.cislService.getDataFromCislCarDetails(this.requestParams).subscribe(data => this.serializeCarModelData(data, true));
		//this.showCarVersion=true;

		this.antiTheftSecurity = carDetailsData.antiTheftOption;

		this.requestParams = this.createRequestforCisl("vehicleModel", this.carModelSelected);
		this.cislService.getDataFromCislVehicleCharacteristics(this.requestParams).subscribe(data => this.serializeVehicleCharData(data, true, carDetailsData));
		this.addRemoveCarEngineSizeClasses();
		this.addRemoveCarEnginePowerClasses();
	}
	serializeCarBrandData(data) {
		
		let carItems = data[0].items;
		for (let i = 0; i < carItems.length; i++) {
			if (carItems[i].key == 'POPULAR') {
				this.carBrandPopular.push(carItems[i].value);
			} else if (carItems[i].key == 'ORDINARY') {
				this.carBrandNonPoupular.push(carItems[i].value);
			}
		}
	}
	serializeProdYearData(data) {
		let prodYears = data[0].items;
		this.productionYears = [];
		for (let i = 0; i < prodYears.length; i++) {
			this.productionYears.push(prodYears[i].value);
		}
		this.productionYears.sort(function (a, b) {
			if (parseInt(a) < parseInt(b)) {
				return 1;
			} else if (parseInt(a) > parseInt(b)) {
				return -1;
			} else {
				return 0;
			}
		})
	}
	serializefuelTypeData(data: any, toPopulateStoredData: boolean): void {
		let fTypes = data[0].items;
		this.fuelTypes = [];
		if (fTypes.length == 1) {
			this.fuelType = fTypes[0].key;
			this.showFuelType = false;
			if (!toPopulateStoredData) {
				this.requestParams = this.createRequestforCisl("fuelType", this.fuelType);
				this.cislService.getDataFromCislCarDetails(this.requestParams).subscribe(data => this.serializeCarBodyData(data, false));
			}
		} else {
			for (let i = 0; i < fTypes.length; i++) {
				if (fTypes[i].key === 'E' || fTypes[i].key === 'P' || fTypes[i].key === 'O' || fTypes[i].key === 'H' || fTypes[i].key === 'G') {
					var temp = { "key": "", "value": "" };
					temp.key = fTypes[i].key;
					temp.value = fTypes[i].value;
					this.fuelTypes.push(temp);
				}
			}
			var length = this.fuelTypes.length;
			if (length == 2) {
				this.bsFuelType = "l-grid__column-large-6 l-grid__column-medium-6 l-grid__column-12";
			} else if (length == 3) {
				this.bsFuelType = "l-grid__column-large-4 l-grid__column-medium-4 l-grid__column-12";
			}
			else if (length >= 4) {
				this.bsFuelType = "l-grid__column-large-3 l-grid__column-medium-3 l-grid__column-12 c-poland-radio-circle-group__item";
			}
			this.showFuelType = true;
		}
	}
	serializeCarBodyData(data: any, toPopulateStoredData: boolean) {
		let carBodyData = data[0].items;
		this.carBodyTypes = [];
		if (carBodyData.length == 1) {
			this.carBody = carBodyData[0].key;
			this.showCarBody = false;
			if (!toPopulateStoredData) {
				this.requestParams = this.createRequestforCisl("bodyType", this.carBody);
				this.cislService.getDataFromCislCarDetails(this.requestParams).subscribe(data => this.serializeCarModelData(data, false));
			}
		} else {
			var tempOSmodel = { key: '', value: '' };
			for (let i = 0; i < carBodyData.length; i++) {
				var tempModel = { key: '', value: '' };
				if (carBodyData[i].key === 'SED' || carBodyData[i].key === 'KB'
					|| carBodyData[i].key === 'HB' || carBodyData[i].key === 'O'
					|| carBodyData[i].key === 'D' || carBodyData[i].key === 'OS') {
					if (carBodyData[i].key === 'OS') {
						tempOSmodel.key = carBodyData[i].key;
						tempOSmodel.value = carBodyData[i].value;
					} else {
						tempModel.key = carBodyData[i].key;
						tempModel.value = carBodyData[i].value;
						this.carBodyTypes.push(tempModel);
					}
				}
			}
			if (tempOSmodel.key != '') {
				this.carBodyTypes.push(tempOSmodel);
			}
			var length = this.carBodyTypes.length;

			if (length <= 4) {
				this.bsCarBodyType = "l-grid__column-large-3 l-grid__column-medium-3 l-grid__column-12";
			} else {
				this.bsCarBodyType = "l-grid__column-large-4 l-grid__column-medium-4 l-grid__column-12";
			}
			this.showCarBody = true;
		}
	}
	serializeCarModelData(data, toPopulateStoredData) {
		let models = data[0].items;
		this.carModels = [];
		if (models.length == 1) {
			this.showCarModel = false;
			this.carModelSelected = models[0].value;
			if (!toPopulateStoredData) {
				this.requestParams = this.createRequestforCisl("vehicleModel", this.carModelSelected);
				this.cislService.getDataFromCislVehicleCharacteristics(this.requestParams).subscribe(data => this.serializeVehicleCharData(data, false, ''));
			}
			//this.showCarEngine = true;
		} else if (models.length < 1) {
			this.showCarModel = false;
			this.showCarVersion = true;
			this.showCarVersionTable = true;
			this.showCarEngine = true;
			this.carModelSelected = '';
		} else {
			this.showCarModel = true;
			for (let i = 0; i < models.length; i++) {
				var tempModel = { key: '', value: '' };
				tempModel.key = models[i].key;
				tempModel.value = models[i].value;
				this.carModels.push(tempModel);
			}
			var length = this.carModels.length;
			if (length <= 2) {
				this.bsJustifyCenter = "justify-content-center";
			} else {
				this.bsJustifyCenter = "";
			}
		}
	}
	serializeAntiTheftOptions(data) {
		let models = data.options;
		this.antiTheftModels = [];
		let temp = { key: '', value: '' };
		for (let i = 0; i < models.length; i++) {
			if (models[i].value == "O") {
				temp.key = models[i].value;
				temp.value = models[i].label;
			} else {
				var tempModel = { key: '', value: '' };
				tempModel.key = models[i].value;
				tempModel.value = models[i].label;
				this.antiTheftModels.push(tempModel);
			}
		}
		this.antiTheftModels.push(temp);
		this.assignAntiTheftOtions("");

	}
	/*Car Version table */
	serializeCarVersionTableData(data, carEngineSize, carEnginePower) {
		let models = data;
		//this.showCarModel = true;
		this.carVersionModels = [];
		for (let i = 0; i < models.length; i++) {
			var tempModel = { version: '', power: 0, body: '', id: '', cubicCapacity: '' };
			if ((carEngineSize != this.NO_VAL && carEngineSize != '') && (carEnginePower != this.NO_VAL && carEnginePower != '')) {
				if (models[i].power == carEnginePower && models[i].cubicCapacity == carEngineSize) {
					tempModel.version = models[i].vehicleBrand + ' ' + this.carModelSelected + ' ' + (models[i].modelDetail === undefined ? '' : models[i].modelDetail);
					tempModel.power = parseInt(models[i].power);
					tempModel.body = (models[i].numberOfDoors === undefined ? '' : models[i].numberOfDoors);
					tempModel.id = models[i].expertCatalogIdentificationNumber;
					tempModel.cubicCapacity = models[i].cubicCapacity ? models[i].cubicCapacity : '';
					this.carVersionModels.push(tempModel);
				}
			} else if (carEngineSize != this.NO_VAL && carEngineSize != '' && (carEnginePower == this.NO_VAL || carEnginePower == '')) {
				if (models[i].cubicCapacity == carEngineSize) {
					tempModel.version = models[i].vehicleBrand + ' ' + this.carModelSelected + ' ' + (models[i].modelDetail === undefined ? '' : models[i].modelDetail);
					tempModel.power = parseInt(models[i].power);
					tempModel.body = (models[i].numberOfDoors === undefined ? '' : models[i].numberOfDoors);
					tempModel.id = models[i].expertCatalogIdentificationNumber;
					tempModel.cubicCapacity = models[i].cubicCapacity ? models[i].cubicCapacity : '';
					this.carVersionModels.push(tempModel);
				}
			} else if (carEnginePower != this.NO_VAL && carEnginePower != '' && (carEngineSize == this.NO_VAL || carEngineSize == '')) {
				if (models[i].power == carEnginePower) {
					tempModel.version = models[i].vehicleBrand + ' ' + this.carModelSelected + ' ' + (models[i].modelDetail === undefined ? '' : models[i].modelDetail);
					tempModel.power = parseInt(models[i].power);
					tempModel.body = (models[i].numberOfDoors === undefined ? '' : models[i].numberOfDoors);
					tempModel.id = models[i].expertCatalogIdentificationNumber;
					tempModel.cubicCapacity = models[i].cubicCapacity ? models[i].cubicCapacity : '';
					this.carVersionModels.push(tempModel);
				}
			} else {
				tempModel.version = models[i].vehicleBrand + ' ' + this.carModelSelected + ' ' + (models[i].modelDetail === undefined ? '' : models[i].modelDetail);
				tempModel.power = parseInt(models[i].power);
				tempModel.body = (models[i].numberOfDoors === undefined ? '' : models[i].numberOfDoors);
				tempModel.id = models[i].expertCatalogIdentificationNumber;
				tempModel.cubicCapacity = models[i].cubicCapacity ? models[i].cubicCapacity : '';
				this.carVersionModels.push(tempModel);
			}
		}
		this.carVersionSize = String(this.carVersionModels.length);
		this.carModelDetail = this.selectedCarBrand + " " + this.carModelSelected;
	}
	serializeCarEngineDataSize(data) {
		let models = data;
		this.carEngineSize = [];
		let obj = {};
		for (let i = 0; i < models.length; i++) {
			obj[models[i].cubicCapacity] = true;
		}
		for (let key in obj) {
			if (key != 'undefined') {
				var tempModel = { 'cubicCapacity': '' };
				tempModel.cubicCapacity = key;
				this.carEngineSize.push(tempModel);
			}
		}
		if (this.carEngineSize.length == 1) {
			this.selectedCarEngineSize = this.carEngineSize[0].cubicCapacity;
			this.serializeCarEngineDataPower(this.vehicleCharData);
		}
		this.showcarEngineSize = this.carEngineSize;
	}
	serializeCarEngineDataPower(data) {
		let models = data;
		this.carEnginePower = [];
		let obj = {};
		for (let i = 0; i < models.length; i++) {
			if (this.showcarEngineSize.length > 0) {
				if (models[i].cubicCapacity == this.selectedCarEngineSize) {
					obj[models[i].power] = true;
				}
			} else {
				obj[models[i].power] = true;
			}
		}
		for (let key in obj) {
			if (key != 'undefined') {
				var tempModel = { power: '' };
				tempModel.power = key;
				this.carEnginePower.push(tempModel);
			}
		}
		if (this.carEnginePower.length == 1) {
			this.selectedCarEnginePower = this.carEnginePower[0].power;
		}
		this.showcarEnginePower = this.carEnginePower;
		this.addRemoveCarEnginePowerClasses();
	}
	serializeStandardEquipmentData(data) {
		this.isStdEquipment = true;
		this.showStandardEquip = true;
		this.standeredEquiData = data;
		let models = data[0].items;
		let temp = { key: '', value: '' };
		this.standardEquipmentModels = [];
		if (models == undefined || models.length < 1) {
			this.showStandardEquip = false;
		} else {
			if (models.length > 8) {
				this.showMoreStndEquip = true;
				this.enableMoreStndEq = true;
				this.enableLessStndEq = false;
			} else {
				this.showMoreStndEquip = false;
			}
			for (let i = 0; i < 8; i++) {
				var tempModel = { key: '', value: '' };
				tempModel.key = models[i].key;
				tempModel.value = models[i].value;
				this.standardEquipmentModels.push(tempModel);
			}
		}
	}
	showMoreStandardEquip(event) {
		let models = this.standeredEquiData[0].items;
		let temp = { key: '', value: '' };
		this.standardEquipmentModels = [];
		for (let i = 0; i < models.length; i++) {
			var tempModel = { key: '', value: '' };
			tempModel.key = models[i].key;
			tempModel.value = models[i].value;
			this.standardEquipmentModels.push(tempModel);
		}
		this.enableMoreStndEq = false;
		this.enableLessStndEq = true;
	}
	showLessStandardEquip(event) {
		let models = this.standeredEquiData[0].items;
		let temp = { key: '', value: '' };
		this.standardEquipmentModels = [];
		for (let i = 0; i < 8; i++) {
			var tempModel = { key: '', value: '' };
			tempModel.key = models[i].key;
			tempModel.value = models[i].value;
			this.standardEquipmentModels.push(tempModel);
		}
		this.enableLessStndEq = false;
		this.enableMoreStndEq = true;
		this.standardEquip.nativeElement.focus();
		event.stopPropagation();
	}
	serializeSideOfWheelData(data) {
		let models = data.options;
		this.sideofWheelData = [];
		for (let i = 0; i < models.length; i++) {
			this.sideofWheelData.push(models[i].label);
		}
	}
	/* For Translation purpose*/
	showPolish(): void {
		this.translate.use("pl");
	}
	showEnglish(): void {
		this.translate.use("en");
	}
	fuelTypeCheck(fuelType: string, fuelTypeValue: string): void {



		/* *****************************CAR-FUEL-TYPE****************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
		AEMSet('digitalData.quote.quoteData.fuelType', fuelTypeValue);
		//AEMTrack('carFuelType');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ***************************************************************************** */




		if (fuelType != this.fuelType) {
			this.carBody = '';
			this.showCarModel = false;
			this.showCarVersion = false;
			this.carVersion = false;
			this.showCarVersionTable = false; //added
			this.showStandardEquip = false;
			this.carVersionId = '';
			this.showOtherAntiTheftDesc = false;
			this.otherAntiTheftDesc = '';
			this.showSideOfWheel = false;
			this.sideofWheelSelected = 'Left';
			this.showCarEngine = false;
			this.showNextButton = false;

			//For refreshing antitheft security options
			this.deSelectedAllAnti = false;
			this.flagTheft = false;
			this.modelImmobilize = false;
			this.modelAlarm = false;
			this.modelGps = false;
			this.modelOther = false;
			this.modelGearLock = false;
			this.optionSelected = false;
			this.nextClicked = false;
			//this.nextClicked = false;
			setTimeout(() => {
				this.flagTheft = true;
			}, 0);
			this.fuelType = fuelType;
			this.requestParams = this.createRequestforCisl("fuelType", this.fuelType);
			this.cislService.getDataFromCislCarDetails(this.requestParams).subscribe(data => this.serializeCarBodyData(data, false));
		}
	}
	carBodyCheck(carBodyType: string, carBodyTypeValue: string): void {

		/* *****************************CAR-BODY****************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
		AEMSet('digitalData.quote.quoteData.carBody', carBodyTypeValue);
		//AEMTrack('carBodyType');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ***************************************************************************** */


		if (carBodyType != this.carBody) {
			this.carModel = '';
			this.showStandardEquip = false;
			this.carVersionId = '';
			this.showOtherAntiTheftDesc = false;
			this.otherAntiTheftDesc = '';
			this.showSideOfWheel = false;
			this.sideofWheelSelected = 'Left';
			this.showNextButton = false;
			this.showCarVersionTable = false;
			this.showCarEngine = false;
			this.selectedCarEngineSize = this.NO_VAL;
			this.selectedCarEnginePower = this.NO_VAL;
			this.carModelSelected = '';

			//For refreshing antitheft security options
			this.deSelectedAllAnti = false;
			this.flagTheft = false;
			this.modelImmobilize = false;
			this.modelAlarm = false;
			this.modelGps = false;
			this.modelOther = false;
			this.modelGearLock = false;
			this.optionSelected = false;
			this.nextClicked = false;
			//this.nextClicked = false;
			setTimeout(() => {
				this.flagTheft = true;
			}, 0);
			this.carBody = carBodyType;
			this.requestParams = this.createRequestforCisl("bodyType", this.carBody);
			this.cislService.getDataFromCislCarDetails(this.requestParams).subscribe(data => this.serializeCarModelData(data, false));
		}
	}
	carModelCheck(sel: any): void {

		/* ********************DO-NOT-TOUCH***************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
		AEMSet('digitalData.quote.quoteData.carModel', sel);
		//AEMTrack('carModel');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */


		this.selectedCarEnginePower = "";
		this.selectedCarEngineSize = "";
		if (sel != this.carModelSelected) {
			this.showSideOfWheel = false;
			this.showStandardEquip = false;
			this.showNextButton = false;
			this.CarEnginePower = false;
			//this.showCarVersionTable = true;
			this.flagTheft = false;
			this.carVersionId = '';
			this.showOtherAntiTheftDesc = false;
			this.otherAntiTheftDesc = '';
			this.isNextDisable = true;
			this.antiTheftSecurity = '';
			this.anthiTheftValues = '';

			//For refreshing antitheft security options
			this.deSelectedAllAnti = false;
			this.flagTheft = false;
			this.modelImmobilize = false;
			this.modelAlarm = false;
			this.modelGps = false;
			this.modelOther = false;
			this.modelGearLock = false;
			this.optionSelected = false;
			this.nextClicked = false;
			//this.nextClicked = false;
			setTimeout(() => {
				this.flagTheft = true;
			}, 0);
			this.carModelSelected = sel;
			this.requestParams = this.createRequestforCisl("vehicleModel", this.carModelSelected);
			this.cislService.getDataFromCislVehicleCharacteristics(this.requestParams).subscribe(data => this.serializeVehicleCharData(data, false, ''));
		}
	}
	serializeVehicleCharData(vehicledata, populateData, carDetailsData) {
		this.vehicleCharData = vehicledata;
		if (populateData) {
			if (vehicledata.length > 0) {
				this.serializeCarEngineDataSize(this.vehicleCharData);
				this.selectedCarEngineSize = carDetailsData.carEngineSize;
				this.serializeCarEngineDataPower(this.vehicleCharData);
				this.selectedCarEnginePower = carDetailsData.carEnginePower;
				this.showCarEngine = true;
				this.flagTheft = true;
				/*Car version table Data */
				this.serializeCarVersionTableData(vehicledata, this.selectedCarEngineSize, this.selectedCarEnginePower);
				this.carVersionId = carDetailsData.carVersionId;
				this.carVersionName = carDetailsData.carVersionName;
				this.carDoors = carDetailsData.carVersionDoors;
				this.showCarVersionTable = true;
			} else {
				this.selectedCarEngineSize = carDetailsData.carEngineSize;
				this.serializeCarEngineDataSize(this.vehicleCharData);
				this.selectedCarEnginePower = carDetailsData.carEnginePower;
				this.serializeCarEngineDataPower(this.vehicleCharData);
				this.showCarEngine = true;
				this.showCarVersionTable = false;
				this.carVersionId = carDetailsData.carVersionId;
				this.carVersionName = carDetailsData.carVersionName;
				this.carDoors = carDetailsData.carVersionDoors;
			}
			/* Standered Equiment Data */
			this.isStdEquipment = false;
			this.exceptCatalogParams = 'expertCatalogIdentificationNumber=' + this.carVersionId + '&' + 'buildYear=' + this.selectedProdYear;
			this.cislService.getDataFromCislCarDetails(this.exceptCatalogParams).subscribe(data => this.serializeStandardEquipmentData(data));
			this.standardEquipmentSelected = carDetailsData.standardEquipmentSelected;

			/*AntiTheft Option */
			this.cislService.getDataFromCislDatalistType("ANTI_THEFT_SECURITY").subscribe(data => this.serializeAntiTheftOptions(data));
			this.flagTheft = true;
			this.anthiTheftValues = carDetailsData.antiTheftValues;
			this.deSelectedAllAnti = carDetailsData.noneAntiTheft;

			/*Side Of Wheel */
			this.cislService.getDataFromCislDatalistType("SIDE_OF_WHEEL").subscribe(data => this.serializeSideOfWheelData(data));
			this.sideofWheelSelected = carDetailsData.sideofwheel;
			this.showSideOfWheel = true;
			this.showNextButton = true;
			this.isNextDisable = false;
		} else {
			if (vehicledata.length > 0) {
				this.selectedCarEngineSize = this.NO_VAL; //Todo after translation problem resolved   en: choose
				this.selectedCarEnginePower = this.NO_VAL; //Todo after translation problem resolved   en: choose
				this.serializeCarEngineDataSize(this.vehicleCharData);
				this.serializeCarEngineDataPower(this.vehicleCharData);
				this.showCarEngine = true;
				this.serializeCarVersionTableData(this.vehicleCharData, this.selectedCarEngineSize, this.selectedCarEnginePower);
				this.showCarVersionTable = true;
			} else if (vehicledata.length == 0) {
				this.showCarEngine = false;
				this.showCarVersionTable = false;
			} else {
				this.serializeCarEngineDataSize(this.vehicleCharData);
				this.showCarEngine = true;
				this.showCarVersionTable = false;
				this.carVersionId = vehicledata[0].expertCatalogIdentificationNumber;
				this.carVersionName = (vehicledata[0].modelDetail === undefined ? '' : vehicledata[0].modelDetail);
				this.carDoors = (vehicledata[0].numberOfDoors === undefined ? '' : vehicledata[0].numberOfDoors);
				this.showStandardEquip = true;
				this.flagTheft = true;
				this.isStdEquipment = false;
				let params = 'expertCatalogIdentificationNumber=' + this.carVersionId + '&' + 'buildYear=' + this.selectedProdYear;
				this.cislService.getDataFromCislCarDetails(params).subscribe(data => this.serializeStandardEquipmentData(data));
				if (this.antiTheftModels.length < 1) {
					this.cislService.getDataFromCislDatalistType("ANTI_THEFT_SECURITY").subscribe(data => this.serializeAntiTheftOptions(data));
				}
				if (this.sideofWheelData) {
					this.cislService.getDataFromCislDatalistType("SIDE_OF_WHEEL").subscribe(data => this.serializeSideOfWheelData(data));
				}
				this.showSideOfWheel = true;
			}
		}
		this.addRemoveCarEngineSizeClasses();
		this.addRemoveCarEnginePowerClasses();
	}

	assignAntiTheftOtions(carDetailsData) {
		let atSecOpts = [];
		let antiTheftValues = this.anthiTheftValues.split(",");
		for (let j = 0; j < antiTheftValues.length; j++) {
			for (let k = 0; k < this.antiTheftModels.length; k++) {
				if (antiTheftValues[j] == this.antiTheftModels[k].key) {
					atSecOpts.push(this.antiTheftModels[k].value)
				}
			}
		}

		for (var i = 0; i < atSecOpts.length; i++) {
			if (atSecOpts[i] === 'Immobilizer') {
				this.modelImmobilize = true;
				continue;
			}
			else if (atSecOpts[i] === 'Alarm') {
				this.modelAlarm = true;
				continue;
			}
			else if (atSecOpts[i] === 'Blokada skrzyni biegów') {
				this.modelGearLock = true;
				continue;
			}
			else if (atSecOpts[i] === 'Monitoring GPS') {
				this.modelGps = true;
				continue;
			}
			else if (atSecOpts[i] === 'Inne') {
				this.modelOther = true;
				this.showOtherAntiTheftDesc = true;
				this.otherAntiTheftDesc = carDetailsData == "" ? "" : carDetailsData.otherAntiTheftDesc;
				continue;
			}
		}

	}
	standarEquipCheck(): void {
		this.showCarVersionTable = true;
		this.showStandardEquip = true;
		this.carVersion = true;
	}
	carVersionTableCheck(versionId: string, versionName: string, body: string, cubicCapacity: string, power: string): void {
		if (versionId != this.carVersionId) {
			this.selectedCarEngineSize = cubicCapacity;
			this.selectedCarEnginePower = power;
			this.carVersionId = versionId;
			this.carVersionName = versionName.replace((this.selectedCarBrand + ' ' + this.carModelSelected + ' '), '');



			/* *****************************CAR-MODEL-VERSION****************************************** */

			/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
			AEMSet('digitalData.quote.quoteData.carModelVersion', versionName);
			//AEMTrack('carModelVersion');

			/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

			/* ***************************************************************************** */

			this.carDoors = body;
			this.flagTheft = true;
			this.isStdEquipment = false;
			let params = 'expertCatalogIdentificationNumber=' + this.carVersionId + '&' + 'buildYear=' + this.selectedProdYear;
			this.cislService.getDataFromCislCarDetails(params).subscribe(data => this.serializeStandardEquipmentData(data));

			//For refreshing antitheft security options
			this.deSelectedAllAnti = false;
			this.flagTheft = false;
			this.modelImmobilize = false;
			this.modelAlarm = false;
			this.modelGps = false;
			this.modelOther = false;
			this.modelGearLock = false;
			this.optionSelected = false;
			this.nextClicked = false;
			//this.nextClicked = false;
			setTimeout(() => {
				this.flagTheft = true;
			}, 0);
			this.cislService.getDataFromCislDatalistType("ANTI_THEFT_SECURITY").subscribe(data => this.serializeAntiTheftOptions(data));
			this.showOtherAntiTheftDesc = false;
			this.otherAntiTheftDesc = '';
			this.cislService.getDataFromCislDatalistType("SIDE_OF_WHEEL").subscribe(data => this.serializeSideOfWheelData(data));
			this.showSideOfWheel = true;
			this.isNextDisable = true;
		}
	}
	antiTheftCheck(data: any, value: any): void {


		/* *****************************CAR-antitheft-security****************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
		AEMSet('digitalData.quote.quoteData.antiTheftSecurity', data);
		//AEMTrack('securities');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ***************************************************************************** */

		if (this.antiTheftSecurity.includes(data)) {
			this.antiTheftSecurity = this.antiTheftSecurity.replace("," + data, "");
			this.anthiTheftValues = this.anthiTheftValues.replace("," + value, "");
		} else {
			this.antiTheftSecurity += "," + data;
			this.anthiTheftValues += "," + value;
		}
		if (this.modelImmobilize === false &&
			this.modelAlarm === false &&
			this.modelGps === false &&
			this.modelOther === false &&
			this.modelGearLock === false) {
			this.isNextDisable = true;
		} else {
			this.isNextDisable = false;
		}
		/*if(this.antiTheftSecurity == ''){
			this.nextClicked = true;
		}else{
			this.nextClicked = false;
			this.nextClicked = false;
		}*/
	}
	showDropDownCarBrand(ele: any): void {

		this.showCarBrandPopular = this.carBrandPopular;
		this.showCarBrandNonPopular = this.carBrandNonPoupular;
		ele.classList.add("is-opened");
		this.firstTimeCarBrandDDCall = true;
	}
	onKeyCarBrand(event: any) {
		var typedVal = event.target.value;
		var k = event.keyCode;
		var newArrayPop = [];
		var newArrayOrd = [];
		var p = 0;
		var q = 0;
		var toShowFull = 0;
		//var carBrandTotal = this.carBrandPopular.concat(this.carBrandNonPoupular);

		if (typedVal != '') {
			for (var i = 0; i < this.carBrandPopular.length; i++) {
				if (typedVal.length <= this.carBrandPopular[i].length) {
					if (this.carBrandPopular[i].substring(0, typedVal.length).toUpperCase() == typedVal.toUpperCase()) {
						newArrayPop[p++] = this.carBrandPopular[i];
					}
				}
			}
			for (var i = 0; i < this.carBrandNonPoupular.length; i++) {
				if (typedVal.length <= this.carBrandNonPoupular[i].length) {
					if (this.carBrandNonPoupular[i].substring(0, typedVal.length).toUpperCase() == typedVal.toUpperCase()) {
						newArrayOrd[q++] = this.carBrandNonPoupular[i];
					}
				}
			}
			if (k == 13) {
				if (p == 0 && q == 1) {
					this.hideDropDownCarBrand(this.dropDownCarBrand.nativeElement, newArrayOrd[0], this.carBrandEvent);
				} else if (p == 1 && q == 0) {
					this.hideDropDownCarBrand(this.dropDownCarBrand.nativeElement, newArrayPop[0], this.carBrandEvent);
				}
			}
			this.showCarBrandPopular = newArrayPop;
			this.showCarBrandNonPopular = newArrayOrd;
		} else {
			this.showCarBrandPopular = this.carBrandPopular;
			this.showCarBrandNonPopular = this.carBrandNonPoupular;
		}
	}
	hideDropDownCarBrand(ele: any, sel: any, event): void {
		this.carBrandInputValue = '';
		if (this.selectedCarBrand != sel) {
			this.selectedProdYear = this.NO_VAL;
			this.showFuelType = false;
			this.fuelType = '';
			this.showCarBody = false;
			this.carModel = '';
			this.selectedCarEngineSize = '';
			this.selectedCarEnginePower = '';
			this.showCarModel = false;
			this.showCarVersionTable = false;
			this.carVersion = false;
			this.showCarVersion = false;
			this.showStandardEquip = false;
			this.carVersionId = '';
			this.showOtherAntiTheftDesc = false;
			this.otherAntiTheftDesc = '';
			this.antiTheftSecurity = '';
			this.anthiTheftValues = '';
			this.showSideOfWheel = false;
			this.showNextButton = false;
			this.showCarEngine = false;

			//For refreshing antitheft security options
			this.flagTheft = false;
			this.modelImmobilize = false;
			this.modelAlarm = false;
			this.modelGps = false;
			this.modelOther = false;
			this.modelGearLock = false;
			this.optionSelected = false;
			this.deSelectedAllAnti = false;
			this.nextClicked = false;
			//this.nextClicked = false;
			setTimeout(() => {
				this.flagTheft = true;
			}, 0);
			this.selectedCarBrand = sel;

			


			/* *****************************CAR-BRAND****************************************** */

			/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
			AEMSet('digitalData.quote.carBrand', sel);
			//AEMTrack('carBrandSelect');

			/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

			/* ***************************************************************************** */



			this.requestParams = this.createRequestforCisl("vehicleBrand", this.selectedCarBrand.toUpperCase());
			this.cislService.getDataFromCislCarDetails(this.requestParams).subscribe(data => this.serializeProdYearData(data));
		}
		this.dropDownCarBrand.nativeElement.classList.remove("is-opened");
		this.carBrandEvent = event;
		event.stopPropagation();
	}
	createRequestforCisl(reqKey: string, reqParam: string): any {
		if (reqKey == 'vehicleBrand') {
			this.requestParams = reqKey + '=' + reqParam;
		} else if (this.requestParams.includes(reqKey)) {
			this.requestParams = this.requestParams.substring(0, this.requestParams.indexOf(reqKey));
			this.requestParams += reqKey + '=' + reqParam;
		} else {
			this.requestParams += '&' + reqKey + '=' + reqParam;
		}
		return this.requestParams;
	}
	hideDDCarBrandClickOutside(ele: any, event): void {
		if (!this.firstTimeCarBrandDDCall && ele.classList.contains("is-opened")) {
			ele.classList.remove("is-opened");
			event.stopPropagation();
		}
		this.carBrandInputValue = '';
		this.firstTimeCarBrandDDCall = false;
	}
	showDropDownProdYear(ele: any): void {
		if (this.selectedCarBrand != this.NO_VAL) {
			this.showProdYear = this.productionYears;
			ele.classList.add("is-opened");
			this.prodYearList.nativeElement.scrollTop = 0;
			this.firstTimeProdYearDDCall = true;
		}
	}
	onKeyProdYear(event: any) {
		var typedVal = event.target.value;
		var k = event.keyCode;
		var newArray = [];
		var p = 0;
		var toShowFull = 0;
		if (typedVal != '') {
			for (var i = 0; i < this.productionYears.length; i++) {
				if (typedVal.length <= this.productionYears[i].length) {
					if (this.productionYears[i].substring(0, typedVal.length) == typedVal) {
						newArray[p++] = this.productionYears[i];
					}
				}
			}
			if (k == 13) {
				if (p == 1) {
					this.hideDropDownProdYear(this.dropDownProdYear.nativeElement, newArray[0], this.prodYearEvent);
				}
			}
			this.showProdYear = newArray;
		} else {
			this.showProdYear = this.productionYears;
		}
	}
	hideDropDownProdYear(ele: any, sel: any, event): void {
		this.prodYearInputValue = '';
		if (this.selectedProdYear != sel) {
			this.fuelType = '';
			this.showCarBody = false;
			this.showCarModel = false;
			this.carBody = '';
			this.carModel = '';
			this.showCarVersionTable = false;
			this.carVersion = false;
			this.showCarVersion = false;
			this.showCarEngine = false;
			this.showStandardEquip = false;
			this.carVersionId = '';
			this.showOtherAntiTheftDesc = false;
			this.otherAntiTheftDesc = '';
			this.antiTheftSecurity = '';
			this.anthiTheftValues = '';
			this.showSideOfWheel = false;
			this.showNextButton = false;

			//For refreshing antitheft security options
			this.deSelectedAllAnti = false;
			this.flagTheft = false;
			this.modelImmobilize = false;
			this.modelAlarm = false;
			this.modelGps = false;
			this.modelOther = false;
			this.modelGearLock = false;
			this.optionSelected = false;
			this.nextClicked = false;
			//this.nextClicked = false;
			setTimeout(() => {
				this.flagTheft = true;
			}, 0);
			this.selectedProdYear = sel;


			/* *****************************CAR-PRODUCTION-YEAR****************************************** */

			/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
			AEMSet('digitalData.quote.quoteData.carProductionYear', sel);
			//AEMTrack('carProdYear');

			/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

			/* ***************************************************************************** */


			this.requestParams = this.createRequestforCisl("buildYear", this.selectedProdYear);
			this.cislService.getDataFromCislCarDetails(this.requestParams).subscribe(data => this.serializefuelTypeData(data, false));
		}
		this.dropDownProdYear.nativeElement.classList.remove("is-opened");
		this.prodYearEvent = event;
		event.stopPropagation();
	}
	hideDDProdYearClickOutside(ele: any, event): void {
		if (!this.firstTimeProdYearDDCall && ele.classList.contains("is-opened")) {
			ele.classList.remove("is-opened");
			event.stopPropagation();
		}
		this.prodYearInputValue = '';
		this.firstTimeProdYearDDCall = false;
	}
	/* car engine */
	onKeyCarEngineSize(event) {
		var typedVal = event.target.value;
		var newArray = [];
		var p = 0;
		var toShowFull = 0;
		if (typedVal != '') {
			for (var i = 0; i < this.carEngineSize.length; i++) {
				if (typedVal.length <= this.carEngineSize[i].length) {
					if (this.carEngineSize[i].substring(0, typedVal.length) == typedVal) {
						newArray[p++] = this.carEngineSize[i];
					}
				}
			}
			this.showcarEngineSize = newArray;
		} else {
			this.showcarEngineSize = this.carEngineSize;
		}
	}
	onKeyCarEnginePower(event) {
		var typedVal = event.target.value;
		var newArray = [];
		var p = 0;
		var toShowFull = 0;
		if (typedVal != '') {
			for (var i = 0; i < this.carEnginePower.length; i++) {
				if (typedVal.length <= this.carEnginePower[i].length) {
					if (this.carEnginePower[i].substring(0, typedVal.length) == typedVal) {
						newArray[p++] = this.carEnginePower[i];
					}
				}
			}
			this.carEnginePower = newArray;
		} else {
			this.showcarEnginePower = this.carEnginePower;
		}
	}
	showDropDownCarEnginePower(): void {
		if (this.showcarEnginePower.length > 1) {
			this.carEnginePowerClass += " is-opened";
		}
	}
	showDropDownCarEngineSize(): void {
		if (this.showcarEngineSize.length > 1) {
			this.carEngineSizeClass += " is-opened";
		}
	}
	hideDDCarEngineSizeClickOutside(event): void {
		this.addRemoveCarEngineSizeClasses();
		event.stopPropagation;

	}
	hideDDCarEnginePowerClickOutside(event): void {
		this.addRemoveCarEnginePowerClasses();
		event.stopPropagation;
	}
	hideDropDownCarEngineSize(sel: any, event) {
		this.carEngineSizeInputValue = '';
		if (this.selectedCarEngineSize != sel) {
			this.selectedCarEnginePower = this.NO_VAL; //Todo after translation problem resolved   en: choose
			this.showStandardEquip = false;
			this.showCarVersionTable = true;
			this.carVersionId = '';
			this.showOtherAntiTheftDesc = false;
			this.otherAntiTheftDesc = '';
			this.antiTheftSecurity = '';
			this.anthiTheftValues = '';
			this.showSideOfWheel = false;
			this.showNextButton = false;
			//For refreshing antitheft security options
			this.flagTheft = false;
			this.modelImmobilize = false;
			this.modelAlarm = false;
			this.modelGps = false;
			this.modelOther = false;
			this.modelGearLock = false;
			this.optionSelected = false;
			this.deSelectedAllAnti = false;
			this.nextClicked = false;
			//this.nextClicked = false;
			setTimeout(() => {
				this.flagTheft = true;
			}, 0);
			this.selectedCarEngineSize = sel;

			/* *****************************CAR-ENGINE****************************************** */

			/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
			AEMSet('digitalData.quote.quoteData.carEngine.engineSize', sel);
		//	AEMTrack('carEsCc');

			/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

			/* ***************************************************************************** */

		}
		this.serializeCarVersionTableData(this.vehicleCharData, this.selectedCarEngineSize, this.selectedCarEnginePower);
		this.serializeCarEngineDataPower(this.vehicleCharData);
		this.carEngineSizeClass = this.carEngineSizeClass.replace("is-filled", "");
		this.carEngineSizeClass = this.carEngineSizeClass.replace("is-opened", "is-filled");
		event.stopPropagation();
	}
	hideDropDownCarEnginePower(sel: any, event) {
		this.carEngineSizeInputValue = '';
		if (this.selectedCarEnginePower != sel) {
			if (this.showCarVersionTable == true) {
				this.showCarVersionTable = false;
				setTimeout(() => {
					this.showCarVersionTable = true;
				}, 0);
			} else {
				this.showCarVersionTable = true;
			}
			this.showCarVersionTable = true;
			this.carVersion = false;
			this.showStandardEquip = false;
			this.carVersionId = '';
			this.showOtherAntiTheftDesc = false;
			this.otherAntiTheftDesc = '';
			this.antiTheftSecurity = '';
			this.anthiTheftValues = '';
			this.showSideOfWheel = false;
			this.showNextButton = false;

			//For refreshing antitheft security options
			this.deSelectedAllAnti = false;
			this.flagTheft = false;
			this.modelImmobilize = false;
			this.modelAlarm = false;
			this.modelGps = false;
			this.modelOther = false;
			this.modelGearLock = false;
			this.optionSelected = false;
			this.nextClicked = false;
			//this.nextClicked = false;
			setTimeout(() => {
				this.flagTheft = true;
			}, 0);
			this.selectedCarEnginePower = sel;
			this.serializeCarVersionTableData(this.vehicleCharData, this.selectedCarEngineSize, this.selectedCarEnginePower);
			this.showCarVersionTable = true;
		}
		this.carEnginePowerClass = this.carEnginePowerClass.replace("is-filled", "");
		this.carEnginePowerClass = this.carEnginePowerClass.replace("is-opened", "is-filled");

		/* *****************************CAR-ENGINE****************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
		AEMSet('digitalData.quote.quoteData.carEngine.enginePower', sel);
		//AEMTrack('carEnginePower');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ***************************************************************************** */

		event.stopPropagation();
	}
	acceptOnlyNum(event) {
		let k = event.charCode;
		let val = false;
		if ((k >= 48 && k <= 57) || (k == 0)) {
			return
		}
		else {
			return val;
		}
	}
	sideofWheelCheck(data: any): void {
		this.sideofWheelSelected = data;


		this.showNextButton = true;


	}
	addClass(event): void {
		event.target.classList.add('is-filled');
	}
	removeClass(event): void {
		if (event.target.classList.contains('ng-invalid')) {
			event.target.classList.remove('is-filled');
		}
	}
	ngAfterViewInit() {
		this.progressbarActive.nativeElement.classList.add('c-progress-bar__item--active');
	}
	deselectAll() {
		this.showOtherAntiTheftDesc = false;
		this.otherAntiTheftDesc = '';
		if (this.deSelectedAllAnti) {
			this.flagTheft = false;
			this.modelImmobilize = false;
			this.modelAlarm = false;
			this.modelGps = false;
			this.modelOther = false;
			this.modelGearLock = false;
			this.flagTheft = true;
			this.antiTheftSecurity = '';
			this.anthiTheftValues = '';
			this.isNextDisable = false;
			//this.nextClicked = false;
		} else {
			this.isNextDisable = true;
			//this.nextClicked = true;
		}
	}
	unSelectNone() {
		if (this.deSelectedAllAnti) {
			this.optionSelected = false;
			this.deSelectedAllAnti = false;
			this.isNextDisable = false;
			if (this.modelOther === true) {
				this.showOtherAntiTheftDesc = true;
			} else if (this.modelOther === false) {
				this.showOtherAntiTheftDesc = false;
				this.otherAntiTheftDesc = '';
			}
		} else {
			if (this.modelImmobilize === false &&
				this.modelAlarm === false &&
				this.modelGps === false &&
				this.modelOther === false &&
				this.modelGearLock === false) {
				this.isNextDisable = true;
			} else {
				this.isNextDisable = false;
			}
			if (this.modelOther === true) {
				this.showOtherAntiTheftDesc = true;
			} else if (this.modelOther === false) {
				this.showOtherAntiTheftDesc = false;
				this.otherAntiTheftDesc = '';
			}
		}
	}

	highLightAllRow(event) {
		let tableRow: any = event.target.nodeName == "TD" ? event.target.parentNode : event.target.parentNode.parentNode.parentNode;
		if (this.prvTableRow) {
			this.prvTableRow.classList.remove('c-table__row--highlighted');
		}
		tableRow.classList.add('c-table__row--highlighted');
		this.prvTableRow = tableRow;
	}

	highLightRow(event) {
		let tableRow: any = event.target.parentNode.parentNode.parentNode;
		if (this.prvTableRow) {
			this.prvTableRow.classList.remove('c-table__row--highlighted');
		}
		tableRow.classList.add('c-table__row--highlighted');
		this.prvTableRow = tableRow;
	}
	acceptOnlyNumber(event) {
		let k = event.charCode;
		let val = false;
		if ((k >= 48 && k <= 57) || (event.keyCode == 8)) {
			return
		} else {
			return val;
		}
	}
	acceptOnlyChar(event) {
		let k = event.charCode;
		let val = false;
		if ((k >= 65 && k <= 90) || (k >= 97 && k <= 122) || (k >= 128) || (k == 13) || (event.keyCode == 8)) {
			return true;
		} else {
			return val;
		}
	}
	clickNext(): void {
		if(sessionStorage.getItem("channel") == "AZO_CC"){
			 this.cislService.checkLoggedIn(sessionStorage.getItem("qb_ticket")).subscribe(data => { this.serializeAuthData(); }, err => { this.serializeErr(err); });
		}else {
			this.serializeAuthData();
		}
	}
	serializeAuthData(){
		this.nextClicked = true;
		if (this.applicationSession == null || this.applicationSession == undefined) {
			this.disabledNext = true;
			this.getQuoteId();
		} else if (this.applicationSession.quoteId == null || this.applicationSession.quoteId == '') {
			this.disabledNext = true;
			this.getQuoteId();
		} else {
			//this.disabledNext = true;
			this.validateUserData();
		}
	}
	serializeErr(err){
		if(err.error.errorCode == this.ERR_SSO){
            location.assign("/cclogin");
        }else if(err.error.errorCode == this.ERR_ACCESS_DENIED){
            sessionStorage.clear();
            this.router.navigate(["/unauthoriseduser"]);
        } 
	}
	storeAndNavigate(): void {
		if (!this.applicationSession) {
			this.saveCarDetailsData();
		} else {
			this.saveQuoteService.autoSavePageData();
		}

		this.sendMarketingConsentToCisl();

		AEMTrack('cardetailspagestep1');

		this.router.navigate(['/carusage']);
	}

	getQuoteId() {
		this.cislService.getQuoteId().subscribe(data => { this.setQuodeId(data) });
	}

	setQuodeId(data) {
		this.quoteId = data;
		this.validateUserData();
	}

	hideErrorPopup(data: any) {
		this.hasErrors = data;
	}
	saveCarDetailsData(): void {
		//this.nextClicked = true;
		this.nextClicked = false;
		let carDetails = {
			"carBrand": this.selectedCarBrand,
			"prodYear": this.selectedProdYear,
			"fuelType": this.fuelType,
			"carBody": this.carBody,
			"carModel": this.carModelSelected,
			"carVersionId": this.carVersionId,
			"carVersionName": this.carVersionName,
			"carVersionDoors": this.carDoors,
			"antiTheftOption": this.antiTheftSecurity,
			"antiTheftValues": this.anthiTheftValues,
			"otherAntiTheftDesc": this.otherAntiTheftDesc,
			"sideofwheel": this.sideofWheelSelected,
			"noneAntiTheft": this.deSelectedAllAnti,
			"carEngineSize": this.selectedCarEngineSize,
			"carEnginePower": this.selectedCarEnginePower,
			"consentsArr": this.consentsArr,
			"questionCatelogueId": this.questionCatelogueId,
			"selectedAllConsent": this.selectedAllConsent
		}

		let obj = { "contractId": this.contractId, "quoteId": this.quoteId, "currentPageId": this.saveQuoteService.currentPageId };
		if (this.applicationSession == null || this.applicationSession == undefined) {
			sessionStorage.setItem("Application", JSON.stringify(obj));
		}
		sessionStorage.setItem("carDetails", JSON.stringify(carDetails));


	}

	validateUserData(): void {
		if (this.anthiTheftValues == '' && this.deSelectedAllAnti == false) {
			this.hasErrors = true;
			this.nextClicked = true;
			this.disabledNext = false;
		} else {
			this.disabledNext = true;
			this.storeAndNavigate();
		}
	}
	/* Marketing consents */
	getMarketingConsentsFromCisl() {
		this.cislService.getMarketingConsentsFromCisl(this.contractId, this.consentsId).subscribe(data => { this.serializeMarketingConsents(data) });
	}
	serializeMarketingConsents(data) {
		this.questionCatelogueId = data[0].questionsCatalogueId;
		this.consentsArr = data[0].decisionQuestion;
	}
	serializePutMarketingConsents(data) { }
	setConsents(data) {
		this.isMarketingConsentChecked = !(data.IsConsentValid);
		this.selectedAllConsent = data.SelectedAllConsents;
		this.consentsArr = data.ConsentArray;
	}
	sendMarketingConsentToCisl() {
		this.cislService.sendMarketingConsentsToCisl(this.contractId, this.questionCatelogueId, this.consentsArr).subscribe(data => { this.serializePutMarketingConsents(data) });
	}

	trackSideOfWheel(sideofwheel) {



		/* *****************************CAR-SIDE-OF-WHEELS****************************************** */

		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
		AEMSet('digitalData.quote.quoteData.sideOfWheels', sideofwheel);
	    //AEMTrack('sideofwheel');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ***************************************************************************** */
	}

}
/*
isMandatoryValidation(event) {
		if ((this.antiTheftSecurity !== null)
		     this.isNextDisable = false;
			return true;
		} else {
			this.isNextDisable = true;
			return false;
		}

*/
