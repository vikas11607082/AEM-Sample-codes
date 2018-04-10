import { Injectable, Inject } from '@angular/core';

@Injectable()
export class TextValidationService{
    constructor(){}

    public validatePasel(event, booleVal) {
        let val: string = event.target.value;
        let str = val.slice(9, 10);
        let length = val.length;
        if (length >= 10) {
          if (str == "0" || str == "2" || str == "4" || str == "6" || str == "8") {
            return true;
            
          } else {
            return false;
          }
        } else {
            return false;
        }
      }
    
      //For Special character validation 
      public omitSpecialChar(event) {
        let k;   
        let val = false;
        k = event.charCode;    
        if (k == 32 || k >= 48 && k <= 57) {
          return val;
        } else {
          return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 45 || 0);
        }
      }
    
    //   public omit_special_char_name(event) {
    //     let k;   
    //     let val = false;
    //     k = event.charCode;    
    //     if (k == 32 || k >= 48 && k <= 57) {
    //       return val;
    //     } else {
    //       return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || 0);
    //     }
    //   }
    
      public acceptOnlyNumbers(event) {
        // let k = event.charCode;
        // let val = false;
        // if ((k >= 48 && k <= 57) || k == 0) {
        //   return
        // } else {
        //   return val;
        // }
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
      }

    
    
      public acceptCharSpace(event) {
        let k = event.charCode;
        let val = false;
        if ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 45 || k == 32 || k == 0) {
          return;
        } else {
          return val;
        }
      }
}

