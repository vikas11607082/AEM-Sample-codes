import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import {  RouterTestingModule } from '@angular/router/testing';
import { TranslateService, TranslatePipe } from '../../commons/translate';
import {TRANSLATION_PROVIDERS,TRANSLATIONS,dictionary} from '../../commons/translate';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { DriverDetailsComponent } from '../../quote/components/quote.driverdetails.component';
import {Observable} from 'rxjs/Observable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ClickOutsideDirective} from '../../commons/clickoutside.directive';
import {DppInputDirective} from '../../commons/textinput.directive';
import {DataTableModule} from "angular2-datatable";



describe('DriverDetailsComponent', () => {
  let fixture : ComponentFixture<DriverDetailsComponent>; 
  let comp;
  let translateServiceStub = {
    currentLang: 'pl',
    use: function(lang){this.currentLang=lang}
  };

  var originalTimeout;   
  beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL =10000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

   beforeEach(async(() => {
        TestBed.configureTestingModule({
        imports: [ FormsModule, RouterTestingModule ], 
        providers:    [ {provide: TranslateService, useValue:translateServiceStub }],    
        declarations: [
            DriverDetailsComponent,
            HeaderComponent,
            FooterComponent,
        ],
        }).compileComponents();
        fixture = TestBed.createComponent(DriverDetailsComponent);
        comp = fixture.componentInstance;       
   }))

    it('should create the  driver  Details Component.', async(() => {    
        expect(comp).toBeTruthy();
    }));

    it('check correct Pesel value',function(){
       let event = {'target':{'value':'12345678982'}};
       comp.checkPesel(event);
       expect(comp.isDriverWoman).toBe(true);
    });

    it('check incoreect Pesel value',function(){
       let event = {'target':{'value':'12345678913'}};
       comp.checkPesel(event);
       expect(comp.isDriverWomen).toBe(false);
    });
         
   

    it('lable of radio button should be same as per given ',function(){
//expect(document.getElementById('mainownerPrivatePerson').innerHTML).toBe('The same as owner');
      expect(document.getElementById('2ndowner').innerHTML).toBe('2nd co-owner');
     // expect(document.getElementById('3rdowner').innerHTML).toBe('3rd co-owner');    
     // expect(document.getElementById('other').innerHTML).toBe('Other');
    })

    it('when user select driver details as The same as owner radio button ',function(){
      let el = fixture.debugElement.query(By.css('.c-radio__input'));
      let spanEl = el.nativeElement;
      console.log("element : "+spanEl);
      expect(spanEl.innerHTML).toBeNull;   
    })

    it('test session data',function(){

    })

    it('positive test case for user enter pesel  only number',function(){
      let event = {'target':{'charCode':'56'}};
      comp.acceptOnlyNumbers(event);
      expect(comp.acceptOnlyNumbers(event)).toBe(undefined);
    })

     it('Negative test case for user enter pesel with char',function(){
      let event = {'target':{'charCode':'32'}};
      comp.acceptOnlyNumbers(event);
      expect(comp.acceptOnlyNumbers(event)).toBe(false);
    })

    
    it('positive test case for user enter regon  only number',function(){
      let event = {'target':{'charCode':'56'}};
      comp.acceptOnlyNumbers(event);
      expect(comp.acceptOnlyNumbers(event)).toBe(undefined);
    })

    it('Negative test case for user enter regon with char',function(){
      let event = {'target':{'charCode':'32'}};
      comp.acceptOnlyNumbers(event);
      expect(comp.acceptOnlyNumbers(event)).toBe(false);
    })

    it('test if driver has kid',function(){
      comp.hasDriverKids = false;
      comp.selectDriverKidsY();
      expect(comp.hasDriverKids).toBe(true);
    })

    it('user select private person as main owner on car owner page and filled details then driver details should be filled automatic',function(){
        expect(comp.selectMainOwner()).toBeUndefined;
      
    })

    it('test birthyear ',function(){

      let pesselID = 12345678981;
      comp.getBirthYear(pesselID);
      expect(comp.minimumYear).toBe(1900);
    })
})