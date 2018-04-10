import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import {  RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from './commons/translate';

import { AppRestService } from './app.rest.service';
import { AppUrlService } from './app.url.service';

import { AppComponent } from './app.component';
import {Observable} from 'rxjs/Observable';


describe('AppComponent', () => {
  let fixture : ComponentFixture<AppComponent>; 
  let comp;
  let translateServiceStub = {
    currentLang: 'pl',
    use: function(lang){this.currentLang=lang}
  };
 
  let translateService;
  let appRestService;
  let appUrlService;
  let promiseReturn = {
    "urls": {
      "carbrand": "http://carbrand:8080"
    }
  };

  //let appRestServiceStub = {getData:function().subscribe({return promiseReturn})};
 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ], 
      providers:    [ {provide: TranslateService, useValue:translateServiceStub }, {provide: AppRestService}, {provide: AppUrlService} ],    
      declarations: [
        AppComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    translateService = fixture.debugElement.injector.get(TranslateService);  
    translateService = TestBed.get(TranslateService);

    appRestService = fixture.debugElement.injector.get(AppRestService); 
    appRestService = TestBed.get(AppRestService); 

    appUrlService = fixture.debugElement.injector.get(AppUrlService);  
    appUrlService = TestBed.get(AppUrlService);
  }));

  it('should create the app.', async(() => {    
    expect(comp).toBeTruthy();
  }));

  it('should set language.', (()=>{
     expect(translateServiceStub === translateService).toBe(false);
     translateService.currentLang = 'de';    
     comp.selectLang('pl');    
     expect(translateService.currentLang).toEqual('pl');  

  }))

  it('should call translate service use function.', (()=>{
    spyOn(translateService,'use');
    comp.selectLang('pl');
    expect(translateService.use).toHaveBeenCalledWith('pl');
  }))

  it('should check provided language is same as current language',(() =>{
    translateService.currentLang = 'fr';
    let languageFlag = comp.isCurrentLang('fr');
    expect(languageFlag).toBe(true);

    languageFlag = comp.isCurrentLang('de');
    expect(languageFlag).toBe(false);
  }))

  it('should create the app.', async(() => {    
   console.log(translateService);
   console.log(appRestService);
  }));

});
