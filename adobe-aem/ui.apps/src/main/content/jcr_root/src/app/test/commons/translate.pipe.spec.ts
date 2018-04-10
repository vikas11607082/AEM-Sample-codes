import {TestBed} from '@angular/core/testing';
import {Inject} from '@angular/core';
import { TranslateService, TranslatePipe } from '../../commons/translate';
import {TRANSLATION_PROVIDERS,TRANSLATIONS,dictionary}  from '../../commons/translate';


describe('Translate',()=>{
let translateServiceStub = {
    currentLang: 'pl',
    use: function(lang){this.currentLang=lang}
  };
  let translateservice;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ TranslatePipe ],
            providers: [ {provide: TranslateService, useValue:translateServiceStub}, {provide: TRANSLATION_PROVIDERS},
            ]
        });
    });
 
 it('sanity', () => {
        expect(true).toBeTruthy();
    });

    it('should transform',Inject(TranslateService=>{
  
        let tranPipe =  new  TranslatePipe(translateservice);
        expect(tranPipe.transform('Bonjour',['en'])).toBe("Hello");
    }));


})
