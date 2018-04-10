import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import {  RouterTestingModule } from '@angular/router/testing';
import { TranslateService, TranslatePipe } from '../../commons/translate';
import {TRANSLATION_PROVIDERS,TRANSLATIONS,dictionary} from '../../commons/translate';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { CarUsageComponent } from '../../quote/components/quote.carusage.component';
import {Observable} from 'rxjs/Observable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ClickOutsideDirective} from '../../commons/clickoutside.directive';
import {DppInputDirective} from '../../commons/textinput.directive';
import {DataTableModule} from "angular2-datatable";
import { CislService} from '../../util/util.cisl.service';


describe('CarUsageComponent', () => {
  let fixture : ComponentFixture<CarUsageComponent>; 
  let comp;
  let translateServiceStub = {
    currentLang: 'pl',
    use: function(lang){this.currentLang=lang}
  };

        let translateService;
        let promiseReturn = {
            "urls": {
            "carbrand": "http://carbrand:8080"
            }
        };

        
  let cislServiceStud = {

      data:{'carbrand':'BMW',
          'productionYears':['2001','2002','2004'],
      },
      cislUrlCarDetails : 'http://localhost:8080/domain/vehicledetails',

      getDataFromCislCarDetails:function(url){
          this.cislUrlCarDetails =url;
      },
  
    };
        beforeEach(async(() => {
            TestBed.configureTestingModule({
            imports: [ RouterTestingModule, FormsModule, ReactiveFormsModule, DataTableModule,  Ng2AutoCompleteModule, ], 
            providers:    [ {provide: TranslateService, useValue:translateServiceStub}, {provide: TRANSLATION_PROVIDERS}, {provide: CislService }],    
            declarations: [
                CarUsageComponent,
                HeaderComponent,
                FooterComponent,
                TranslatePipe,
                ClickOutsideDirective,
                DppInputDirective
            ],
            }).compileComponents();
            fixture = TestBed.createComponent(CarUsageComponent);
            comp = fixture.componentInstance;
            
        }));    
 
        it('should create the app.', async(() => {    
            expect(comp).toBeTruthy();
        }));  
 
        it('should validate licence plate if user enter space',function(){
           const event ={'charCode':'32'}
           let val  = comp.omit_specialChar(event);
           expect(val).toBe(false);
        })

         it('default value  of licence plate should be blank ',function(){
           let textval = document.getElementById("text1");        
           expect(comp.plateNo).toBeNull;
        })

         it('should validate licence plate if user enter specail char @ ',function(){
           const event ={'charCode':'64'}
           let val  = comp.omit_specialChar(event);
           expect(val).toBe(false);
        })

       it('should validate licence plate with number',function(){
           const event ={'charCode': "8"};
           let val = comp.acceptOnlyNumbers(event);
           expect(val).toBeUndefined;            
         
       });

        it('should validate licence plate',function(){
           const event ={'charCode': "48"};
           let val = comp.acceptOnlyNumbers(event);
           expect(val).toBeUndefined;

       });

      it('current millage should accept number only',function(){
         const event ={'charCode': "8"};
         let val = comp.acceptOnlyNumbers(event);
         expect(val).toBe(false);
      });

      it('if user input current millegae as char',function(){
         const event ={'charCode': "56"};
         let val = comp.acceptOnlyNumbers(event);
         expect(val).toBeUndefined;
      });

      it('first registration should accept number only',function(){
         const event ={'charCode': "8"};
         let val= comp.firstRegiAcceptOnlyNumbers(event);
         expect(val).toBe(false);
	
      });
      it('if user input first registration other than  number ',function(){
         const event ={'charCode': "56"};
         let val= comp.firstRegiAcceptOnlyNumbers(event);
         expect(val).toBeUndefined;
      });
     it('validate firstRegistration date',function(){
         let date  ="22-10-2013";
         let val = comp.firstRegistrationDate(date);
          expect(comp.dateFirstRegistration).toBe(22);
     })
  });