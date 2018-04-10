import { Component ,OnInit, Renderer } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService, TRANSLATIONS } from './commons/translate';
import { AppRestService} from './app.rest.service';
import {UrlSerializer} from '@angular/router';
import { AppUrlService } from './app.url.service';
import { SaveQuoteService } from './savequote/quote.save.service';
import { SaveButtonHideShowService } from './savequote/save.button.hide.show.service';
import { LogoutService } from './logout/logout.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{  
    constructor(private _translate: TranslateService, private _appRestService:AppRestService, private _appUrlService:AppUrlService, private router: Router,
      private _rendrer:Renderer, private _saveQuoteService:SaveQuoteService, private _saveButtonShowHide:SaveButtonHideShowService, private logoutService:LogoutService) { }

    public showSaveEmailConsentPopup:boolean = false;
    public showSaveOkPopup:boolean = false;
    public saveBtn:any;
    public quoteId:any;
    title = 'Quote&Buy';
    public supportedLanguages: any[];
    private urlJsonReqObj = {url : "./assets/appurlconfig.json"};
    public logoutConfirm:boolean = false;

    ngOnInit() {
        this.router.events.subscribe((evt) => {          
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
        
         // standing data
      this.supportedLanguages = [
        { display: 'English', value: 'en' },
        { display: 'Polish', value: 'pl' }
        
      ];

      this._saveQuoteService.CloseSavePopup.subscribe( () => {
        this.showSaveEmailConsentPopup = this._saveQuoteService.showSaveEmailConsentPopup;
        this.showSaveOkPopup = this._saveQuoteService.showSaveConfirmPopup;
      });
      
      this.selectLang('pl');
      this.getUrlJson();
      
    }
    
    ngAfterViewInit(){
      this.saveBtn = document.getElementById('savebtn');
      this.quoteId = document.getElementById('quoteId');
      this._rendrer.listen(this.saveBtn,'click', (event)=>{        
        this._saveQuoteService.openSaveQuotePopup();
        this.showSaveEmailConsentPopup = this._saveQuoteService.showSaveEmailConsentPopup;
        this.showSaveOkPopup = this._saveQuoteService.showSaveConfirmPopup;
      })
      
      this.logoutService.confirmLogout.subscribe(data => {this.logoutConfirm = data});
      this.logoutService.closeLogout.subscribe(data => {this.logoutConfirm = data});

      this._saveButtonShowHide.ShowSaveButton.subscribe(() =>{
        this.saveBtn.classList.remove('hide');        
      })
      
      this._saveButtonShowHide.HideSaveButton.subscribe(() =>{
        this.saveBtn.classList.add('hide');           
      })

      this._saveButtonShowHide.ShowQuoteId.subscribe(() =>{
        this.quoteId.classList.remove('hide');
      })
    }
    

    isCurrentLang(lang: string) {
      return lang === this._translate.currentLang;
    }
    
    selectLang(lang: string): void {
      // set default;
      this._translate.use(lang);
      
    }

    // Get URL configuration Json and set into service for application.
    getUrlJson(){
      this._appRestService.getData(this.urlJsonReqObj).subscribe(data => { this._appUrlService.setUrls(data);});
    }
}
