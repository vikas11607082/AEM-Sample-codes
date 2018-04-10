import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import {  RouterTestingModule } from '@angular/router/testing';
import { TranslateService, TranslatePipe } from '../../commons/translate';
import {TRANSLATION_PROVIDERS,TRANSLATIONS,dictionary} from '../../commons/translate';

import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { CarDetailsComponent } from '../../quote/components/quote.cardetails.component';
import {Observable} from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';
import {ClickOutsideDirective} from '../../commons/clickoutside.directive';
import {DppInputDirective} from '../../commons/textinput.directive';
import {DataTableModule} from "angular2-datatable";
import { CislService} from '../../util/util.cisl.service';
import { DebugElement }    from '@angular/core';

describe('CarDetailsComponent', () => {
  let fixture : ComponentFixture<CarDetailsComponent>; 
  let comp;
    let de:      DebugElement;
  let el:      HTMLElement;
  
  let translateServiceStub = {
    currentLang: 'pl',
    use: function(lang){this.currentLang=lang}
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

       let cislService;
        let translateService;
        let promiseReturn = {
            "urls": {
            "carbrand": "http://carbrand:8080"
            }
        };
        beforeEach(async(() => {
            TestBed.configureTestingModule({
            imports: [ RouterTestingModule, FormsModule, DataTableModule ], 
            providers:    [ {provide: TranslateService, useValue:translateServiceStub}, {provide: TRANSLATION_PROVIDERS}, {provide: CislService,useValue:cislServiceStud }],    
            declarations: [
                CarDetailsComponent,
                HeaderComponent,
                FooterComponent,
                TranslatePipe,
                ClickOutsideDirective,
                DppInputDirective
            ],
            }).compileComponents();
            fixture = TestBed.createComponent(CarDetailsComponent);
            comp = fixture.componentInstance;
            translateService = fixture.debugElement.injector.get(TranslateService);  
            translateService = TestBed.get(TranslateService);

            cislService = fixture.debugElement.injector.get(CislService);
            cislService = TestBed.get(CislService);



        }));

        it('should create the app.', async(() => {    
            expect(comp).toBeTruthy();
        }));

        
        it('should set Polish language.', (()=>{
        expect(translateServiceStub === translateService).toBe(false);
        translateService.currentLang = 'de';    
        comp.showPolish('pl');    
        expect(translateService.currentLang).toEqual('pl');  
        }));


        it('should get data',(()=>{
         expect(cislServiceStud === cislService).toBe(false);
         cislService.cislUrlCarDetails ='http://localhost:8080';
         comp.showDropDownProdYear();
         expect(cislService.data).toEqual('Please select the car Brand');
        }));
    
       it('should set English language.', (()=>{
        expect(translateServiceStub === translateService).toBe(false);
        translateService.currentLang = 'de';    
        comp.showEnglish('en');          
        expect(translateService.currentLang).toEqual('en');  
        }));

        
        it('user should not input character in production years dropdown/textfield.',(()=>{          
            const event ={"charCode": "65"};         
            let val = comp.acceptOnlyNumber(event);           
            expect(val).toBe(false);
         }));

        it('user should not input special character inproduction years dropdown/textfield.',(()=>{          
            const event ={"charCode": "186"};
            console.log("test years if special char");
            let val = comp.acceptOnlyNumber(event);
            expect(val).toBe(false);

         }));

        
        it('user should not input character in production year dropdown/textfield.',(()=>{          
            const event ={"charCode": "8"};
             console.log("test years if char is backspace ");
            let val = comp.acceptOnlyNumber(event);
            expect(val).toBe(false);

         }));

        it('user should input number only in production year dropdown/textfield.',(()=>{          
            const event ={"charCode": "48"};
            let val = comp.acceptOnlyNumber(event);      
            expect(val).toBe(undefined);

         }));

        it('user should  input character in car brand dropdown/textfield.',(()=>{          
            const event ={"charCode": "65"}
            let val = comp.acceptOnlyChar(event);         
            expect(val).toBe(undefined);
         }));
        

        it('user should not input number in car brand dropdown/textfield.',(()=>{          
            const event ={"charCode": "48"};
            let val = comp.acceptOnlyChar(event);
            expect(val).toBe(false);
         }));

        it('user should not input special character in car brand dropdown/textfield.',(()=>{          
            const event ={"charCode": "191"};
            let val = comp.acceptOnlyChar(event);
            expect(val).toBe(false);
         }));

        it('should check production year with partial input.',(()=>{ 
            comp.productionYears = ['1990','1991','2012','2013','2014','2015','2016'];        
            const event ={'target' :{'value':'199'}};               
            comp.onKeyProdYear(event);
            let val =  comp.showProdYear;
            let testArr = ['1990','1991']
            expect(val).toEqual(testArr);
         }));
       
        it('should check complete production year.',(()=>{ 
            comp.productionYears = ['1990','1991','2012','2013','2014','2015','2016'];        
            const event ={'target' :{'value':'1991'}};               
            comp.onKeyProdYear(event);
            let val =  comp.showProdYear;
            let testArr = ['1991']
            expect(val).toEqual(testArr);

         }));

       it('should show dropdown production year list',(()=>{
         let ele =  ['1900','1910','1920','1930','1940','1992','1998','2017'];   
         comp.selectedCarBrand = 'Please Select Car Brand';
         expect(comp.showDropDownProdYear(ele)).toBeUndefined;
    
       }));
         it('should test car model check or not ',(()=>{
         let carmodelkey = true;;   
         comp.selectedCarBrand =false;
         expect(comp.carModelCheck()).toBe(carmodelkey);
    
       }));
      

       it('check equpment check',(()=>{
         expect(comp.standarEquipCheck()).toBeUndefined;
       }));

            
      it('should check if user select none',(()=>{
           let val = true;
           comp.deSelectedAllAnti = true;
           expect(comp.unSelectNone()).toBeUndefined;
       }));

   
     function setInputValue(selector: string, value: string) {
        fixture.detectChanges();
        let input = fixture.debugElement.query(By.css(selector)).nativeElement;
        input.value = value;
        input.dispatchEvent(new Event('input'));

    }

        it('it should have  dropdown value',(()=>{
            expect(cislServiceStud === cislService).toBe(false);
            de = fixture.debugElement.query(By.css('select'));
            el = de.nativeElement;
            console.log('value selected  can be blank or null: '+el.attributes);
            expect(el.contains.toString);

        }));

         it('test input value should not blank',(()=>{
            expect(cislServiceStud === cislService).toBe(false);
            de = fixture.debugElement.query(By.css('select'));
            el = de.nativeElement;                     
            let val = el.nodeValue;
            console.log(' should have value selected : '+val);
            expect(val !='').toBe(true);
            
        }));

  });