import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { CarOwnerDetailsComponent } from '../../quote/components/quote.carownerdetails.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CislService} from '../../util/util.cisl.service';
import { TranslateService, TranslatePipe } from '../../commons/translate';


describe('CarOwnerDetailsComponent', () => {
    let fixture : ComponentFixture<CarOwnerDetailsComponent>; 
    let comp;
    let translateServiceStub = {
          currentLang: 'pl',
          use: function(lang){this.currentLang=lang}
        };
    let translateService;
    var originalTimeout;
    let cislService;

    let cislServiceStud = {

      data:{'carbrand':'BMW',
          'productionYears':['2001','2002','2004'],
      },
      cislUrlCarDetails : 'http://localhost:8080/domain/vehicledetails',

      getDataFromCislCarDetails:function(url){
          this.cislUrlCarDetails =url;
      },
  
    };

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL =20000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        imports: [ FormsModule, RouterModule ,RouterTestingModule ], 
        providers:    [ {provide: TranslateService, useValue:translateServiceStub },{provide: CislService,useValue:cislServiceStud }],    
        declarations: [
            CarOwnerDetailsComponent,
            HeaderComponent,
            FooterComponent
        ],
        }).compileComponents();
        fixture = TestBed.createComponent(CarOwnerDetailsComponent);
        comp = fixture.componentInstance;       

            cislService = fixture.debugElement.injector.get(CislService);
            cislService = TestBed.get(CislService);
    }));

    it('should create the Car owner Details Component.', async(() => {    
        expect(comp).toBeTruthy();
    }));
    
    it('user should not input character in pessel',function(){          
        const event ={'charCode': "8"};
        let val = comp.acceptOnlyNumbers(event);
        expect(val).toBe(false);
    });

    it('user should not input character in pessel',function(){          
        const event ={'charCode': "56"};
        let val = comp.acceptOnlyNumbers(event);
        expect(val).toBe(undefined);
    });

    it('user should enter space character in company .',function(){          
        const event ={'charCode': "45"};
        let val = comp.acceptCharSpace(event);
        expect(val).toBeUndefined;
    });

    it('user should enter special character in company .',function(){          
        const event ={'charCode': "3"};
        let val = comp.acceptCharSpace(event);
        expect(val).toBeUndefined;
    });

    it('user should  input valid character in firstname',function(){          
        const event ={'charCode': "32"};
        let val = comp.omit_special_char(event);
        expect(val).toBe(false);
    });

    it('if user input invalid character in firstname',function(){          
        const event ={'charCode': "65"};
        let val = comp.omit_special_char(event);
        expect(val).toBe(true);
    });
    
    it('check correct Pesel value',function(){
       let peselVal = "12345678910";
        expect(comp.validatePasel(peselVal)).toBe(true);
    });

    it('check incoreect Pesel value',function(){
      let peselVal = "1234567890";
       expect(comp.validatePasel(peselVal)).toBe(false);
    });

    it('check correct Regon value',function(){
      let regonVal ="123456789";
      expect(comp.validateRegon(regonVal)).toBe(true);
    });

    it('check incorrect Regon value',function(){
      let regonVal ="12345679";
      expect(comp.validateRegon(regonVal)).toBe(false);
    });

    it('user fill details as main owners ',function(){
      comp.mainOwner="PrivatePerson";
      comp.mainOwnerName ="ABC";
      comp.mainOwnerSurname  = "XYZ"
      comp.mainOwnerPesel="12334556567";
      comp.mainOwnerFamName ="XYZ";
      comp.mainOwnerIsWoman ="true";
      expect(comp.validatePrivatePerson()).toBeUndefined;
         
   });

   it('user fill details as main owners sole trader ',function(){
      comp.mainOwner="SoleTrader";
      comp.mainOwnerSoleTraderName ="ABC";
      comp.mainOwnerSoleTraderSurname  = "XYZ"
      comp.mainOwnerSoleTraderPesel="12334556567";
      comp.mainOwnerSoleTraderFamName ="XYZ";
      comp.mainOwnerSoleTraderIsWoman ="true";
      expect(comp.validateSoleTrader()).toBeUndefined;
         
   });

   it('user fill details as main owner as company ',function(){
       comp.mainOwner="Company";
       let  mainOwnerCompName ="ABC";
       let  mainOwnerCompRegon  = "123456789"
       expect(comp.validateOwner(mainOwnerCompName,mainOwnerCompRegon)).toBeUndefined;         
   });

  it('check current owner count',function(){
      const event  =-1;
      expect(comp.carOwnerCount).toBe(event);
  });

  it('check max owner count',function(){
      const event  = 0;      
      expect(comp.carOwnerCount).toBe(-1);
      comp.addCarCoOwner(event);
      expect(comp.carOwnerCount).toBe(0);
      comp.addCarCoOwner(event);
      comp.addCarCoOwner(event);
      expect(comp.carOwnerCount).toBe(2);

  });
  it('test addCoOwner  ',function(){
      let firstowner = true;
      expect(comp.carOwner).toBe(false);
      comp.addCarCoOwner();
      expect(comp.carOwner).toBe(firstowner);
      expect(comp.carCoOwner).toBe(firstowner);
      expect(comp.carCoOwner2).toBe(false);
  })

  it('test addCoOwner2  ',function(){
      let firstowner = true;
      expect(comp.carOwner).toBe(false);
      comp.addCarCoOwner();
      expect(comp.carCoOwner).toBe(firstowner);

  })

  it('check type of main owner  user selected',()=>{
     let type ="PrivatePerson";
     let mainOwnerName ="abc";
     expect(comp.checkDiffMainOwner(type)).toBe(false);
  });

  it('check progress bar css class',function(){
     let cls =  document.getElementById("vehical").className;
     let person = document.getElementById("personal").className;
     expect(cls).toEqual("c-progress-bar__item c-progress-bar__item--active c-progress-bar__item--linear");
     expect(person).toEqual("c-progress-bar__item c-progress-bar__item--active c-progress-bar__item--linear");
  });

  it('user should remove coOwner',function(){
     expect(comp.carCoOwner).toBe(false);
     comp.removeCoOwner(event);
     expect(comp.carCoOwner).toBe(true);
  });

  it('user should not remove mainOwner',function(){
     expect(comp.carCoOwner).toBe(false);
     comp.removeCoOwner(event);
     expect(comp.carOwner).toBe(false);
  });
})