import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {AppComponent} from '../app.component';
import { TranslateService } from '../commons/translate';
import { CislService} from '../util/util.cisl.service';
import { SaveButtonHideShowService } from '../savequote/save.button.hide.show.service';
import { RestoreQuoteSessionService } from '../restorequote/quote.restore.session';
import { LogoutService } from '../logout/logout.service';

@Component({
  selector: 'header-root',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

   @ViewChild('userName') userName: ElementRef
   @ViewChild('logoutDiv') logoutDiv: ElementRef

   isOpen: string;
   public applicationSession:any;
   public quoteId:string = "";
   public ccUserName:string ="";

   constructor(private translate: TranslateService,
               private cislService: CislService,
               private _saveButtonShowHide:SaveButtonHideShowService,
               private restoreQuote: RestoreQuoteSessionService,
               private logoutService: LogoutService) { }
   ngOnInit(){
    this.restoreQuote.emitCCUserName.subscribe(() => {this.ccUserName = this.restoreQuote.ccUserName});
    this._saveButtonShowHide.ShowQuoteId.subscribe(() =>{
      this.applicationSession = JSON.parse(sessionStorage.getItem("Application"));
      if(this.applicationSession !== null && this.applicationSession !== undefined){
        this.quoteId = this.applicationSession.quoteId;
      }      
    })
  }

   
  showPolish(): void {
    this.translate.use("pl");
  }
	
  showEnglish(): void {
    this.translate.use("en");
  }
  
   openDropDown():void{
    this.isOpen="is-open";
   }


  setSearchBox(searchboxClose,searchboxOpen):void{

 searchboxClose.style.display = 'none';
    
    //searchOpen.classList.remove("c-searchbar--hidden");
    searchboxOpen.classList.add("c-searchbar--opened");
     searchboxOpen.style.display ='block';

    //c-searchbar--hidden
    // c-searchbar--hidden" style="display: none;"

  }
   

  closeSearchBox(searchboxClose,searchboxOpen):void{

    searchboxOpen.classList.remove("c-searchbar--opened");
    searchboxOpen.style.display ='none';
    searchboxClose.style.display ='block';
 //event.target.style.display = 'none';
  }

  clickUserName() {
    if(this.userName.nativeElement.classList.contains("has-open-tooltip")){
      this.userName.nativeElement.classList.remove("has-open-tooltip");
      this.logoutDiv.nativeElement.classList.remove("is-open");
    }else {
      this.userName.nativeElement.classList.add("has-open-tooltip");
      this.logoutDiv.nativeElement.classList.add("is-open");
    }
  }

  clickLogout() {
    this.userName.nativeElement.classList.remove("has-open-tooltip");
    this.logoutDiv.nativeElement.classList.remove("is-open");
    //this.cislService.logout().subscribe(data => this.serializeLogout(data));
    this.logoutService.showLogoutConfirm(true);
    this.serializeLogout("");
  }
  
  closeLogoutDD(event){
  	 if(this.userName.nativeElement.classList.contains("has-open-tooltip")){
      this.userName.nativeElement.classList.remove("has-open-tooltip");
      this.logoutDiv.nativeElement.classList.remove("is-open");
      event.stopPropagation();
    }
  }

  serializeLogout(data){
   
  }
}
