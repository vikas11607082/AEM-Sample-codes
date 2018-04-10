import { Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import { ValidateService } from '../../commons/services/validate.service';

@Component({
    selector:'policy-holder',
    templateUrl:'./address.component.html',
    styles:['input {background-color:transparent;}','input:focus {background-color:transparent}','input[readonly] {pointer-events:none;}']
})

export class PolicyHolderAddress implements OnInit{
    @Output() emitContact: EventEmitter<any> = new EventEmitter<any>();
    @Output() emitAddress: EventEmitter<any> = new EventEmitter<any>();
    @Output() emitClickEvent: EventEmitter<any> = new EventEmitter<any>();
    @Input() ownerData;
    @Input() isAddrSame;
    @Input() nextClicked:boolean;

    constructor(private _validateServices: ValidateService){}

    /*public ownerResidentialData = {'title':'',
                                    'type':'privateperson',
                                    'iswomen':false, 'name':'', 'surname':'', 'familyname':'',
                                    'pesel':'', 'regon':'', 'phone':'', 'email':'', 'zip':'',
                                    'street':'', 'houseno':'', 'town':'', 'flatno':''};*/
    public ownerTypeData;
    public ownerTypeContact = [{"key":"Telefon","value":""},
                               {"key":"Email", "value":""}];
    public ownerTypeAddr = [{"key": "Kod pocztowy", "value":""},
                                  {"key": "Miasto", "value":""},
                                  {"key": "Ulica", "value":""},
                                  { "key": "Nr domu", "value": "" },{ "key": "Nr mieszkania", "value": "" }];
    public showAddress;
    private prvKeycode = false;

    ngOnInit() {        
        this.setOwnerTypeandTitle();
        console.log(this.ownerData);
    }
    setOwnerTypeandTitle(){
        this.ownerTypeData = this.ownerData; 
        this.showAddress = this.ownerData.flag;
        this.ownerTypeAddr = this.ownerData.addr;
        if(this.ownerData.contact!=null || this.ownerData.contact != undefined) {
            this.ownerTypeContact = this.ownerData.contact;
        } else {
            this.ownerTypeContact = null;
        }    
       // for(let owner)

        /*this.ownerResidentialData.title = this.ownerData.title;
        this.ownerResidentialData.type = this.ownerData.type;
        this.ownerResidentialData.name = this.ownerData.name;*/

    }
    emitContactData() {
        this.emitContact.emit({"key":this.ownerData.key,"value":this.ownerTypeContact});
    }
    emitAddr() {
        this.emitAddress.emit({"key":this.ownerData.key,"value":this.ownerTypeAddr});
    }
    sendClickEvent(data:any) {
        this.emitClickEvent.emit({"key":this.ownerData.key, "value":data});
    }
    validate(event, fieldName) {
        if(this._validateServices.validateFields(event, fieldName)) {
            return true;
        }else {
            return false;
        } 
    }
    checkValueKeyup(event, obj) {
    obj.value = event.target.value;
    if(obj.key == "Kod pocztowy") {
      var zipcode = event.target.value;
      if (zipcode.length == 2 && event.keyCode!==8) {
        obj.value = zipcode.substring(0, 2) + "-" + zipcode.slice(3, 6);
      }
      if (zipcode.length == 6) {
        if(zipcode.indexOf("-") === -1){
          obj.value = zipcode.substring(0, 2) + "-" + zipcode.slice(3, 6);	
        }
       // this.validateZipCode(this.selectedOwnerTypeAddrRes[0].value, this.selectedOwnerTypeAddrMail[0].value);              
      }
    } else if(obj.key=="Email") {    
       
    } else if(obj.key=="Telefon") {
      
    } else if(obj.key == "Miasto") {

    } else if(obj.key == "Ulica") {

    } else if(obj.key == "Nr domu" || obj.key=="Nr mieszkania") {     
    }
  }
}