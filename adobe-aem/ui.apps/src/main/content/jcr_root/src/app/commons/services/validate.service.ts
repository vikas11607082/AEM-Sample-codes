import { Injectable, Inject, Optional } from '@angular/core';

@Injectable()
export class ValidateService {

    private prvKeycode;

    validateFields(event, fieldName) {
        if (fieldName == "Nazwa") {
            var k = event.charCode;
            if(event.target.value.length >= 30) {
                if(k == 8 || k == 0) {
                    return true;
                }else {
                    return false;
                }                
            } else {
                if ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 0 || k >= 128) {
                    return true;
                } else {
                    return false;
                }
            }            
        } else if (fieldName == "Nazwisko" || fieldName == "Nazwisko rodowe") {
            var k = event.charCode;
            if(event.target.value.length >= 50) {
                if(k == 8 || k == 0) {
                    return true;
                }else {
                    return false;
                }
            }else {
                if ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 0 || k == 45 || k >= 128) {
                    return true;
                } else {
                    return false;
                }
            }           
        } else if (fieldName == "REGON") {
            var k = event.charCode;                
                if (k >= 48 && k <= 57 || k == 32 || k == 8 || k == 0) {
                    if(event.target.value.length >= 14){
                        if(k==8 || k==0){
                            return true;
                        }else{
                            return false;
                        }
                    }else {
                        return true;
                    }
                } else {
                    return false;
                }                      
        } else if(fieldName == "PESEL") {
            var k = event.charCode;                
            if(event.target.value.length < 11) {
                if (k >= 48 && k <= 57 || k == 32 || k == 8 || k == 0) {
                    return true;
                } else {
                    return false;
                } 
            } else {
                if(k==8 || k==0){
                   return true;
                }else{
                   return false;
                }
            }                 
        } else if(fieldName == "Kod pocztowy") {
            var k = event.charCode; 
                if(k >= 48 && k <= 57 || k == 8 || k == 0) {
                    if (event.target.value.length >= 6 ) {
                        if(k==0 || k == 8) {
                            return true;
                        }else {
                            return false;
                        }
                    } else {
                        return true;
                    } 
                }else  {
                    return false;
                }                  
        } else if (fieldName == "Company Name" || fieldName == "Bank Name" || fieldName == "Leasing Name") {
            var k = event.charCode;
            if (this.prvKeycode == 32 && k == 32) {
                return false;
            }
            if ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 0 || k == 32 || k == 45 || k >= 128) {
                this.prvKeycode = k;
                return true;
            } else {
                return false;
            }
        } else if (fieldName == "Telefon") {
            var k = event.charCode;            
            if ((k >= 48 && k <= 57) || k == 43 || k == 8 || k == 0) {
              if(event.target.value.length >= 12) {
                  if(k == 8 || k == 0) {
                     return true;
                  }else {
                     return false;
                  }
              }else {
                return true;
              }              
            } else {
              return false;
            }
        } else if (fieldName == "Email") {
            var k = event.charCode;
            if(event.target.value.length > 99) {                
                if(k==8 || k==0){
                    return true;
                }else{
                    return false;
                }
            }else {
                 if(k!=32){
                 return true;   
                }
            }           
        } else if (fieldName == "Miasto") {
            if(event.target.value.length > 99) {
                if(k==8 || k==0){
                    return true;
                }else{
                    return false;
                }
            }else {
                return true;
            }
        } else if (fieldName == "Ulica") {
           if(event.target.value.length > 99) {
               if(k==8 || k==0){
                    return true;
                }else{
                    return false;
                }
            }else {
                return true;
            }
        } else if (fieldName == "Nr domu" || fieldName == "Nr mieszkania") {
            if(event.target.value.length >= 10) {
               if(k==8 || k==0){
                    return true;
                }else{
                    return false;
                }
            }else {
                return true;
            }
        } else if(fieldName == "vin") {            
            var k = event.charCode;
            if((k==105||k==73) || (k==111 || k==79) || (k==113 || k==81)) {
                return false;
            }else {
                if ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57) || k == 8 || k == 0 || k == 45) {                   
                    return true;
                } else {
                    return false;
                }
            }            
        } else if(fieldName == "license") {
            var k = event.charCode;            
            if ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57) || k == 8 || k == 0) {
                return true;
            } else {
                return false;
            }
        }
    }
    validatePesel(pesel):boolean {
         var valid=false;
            if (pesel.length < 11) {
            return valid;
            } else {
            var PESEL=[];
            for(var i=0;i<pesel.length;i++) {
                PESEL[i]=parseInt(pesel.substring(i,i+1));
            }
            if (this.checkSum(PESEL) && this.checkMonth(PESEL) && this.checkDay(PESEL)) {
                        valid = true;
                    }
                    else {
                        valid = false;	
                    }
            return valid;
            }
  }
  checkSum(PESEL:any): boolean {
    var sum = 1 * PESEL[0] + 
		          3 * PESEL[1] +
              7 * PESEL[2] +
              9 * PESEL[3] +
              1 * PESEL[4] +
              3 * PESEL[5] +
              7 * PESEL[6] +
              9 * PESEL[7] +
              1 * PESEL[8] +
              3 * PESEL[9];
		sum %= 10;
		sum = 10 - sum;
		sum %= 10;
		if (sum == PESEL[10]) {
			return true;
		}
		else {
			return false;
		}
  }
  checkMonth(PESEL:any):boolean {
    var month = this.getBirthMonth(PESEL);
	var day = this.getBirthDay(PESEL);
		if (month > 0 && month < 13) {
			return true;
		}
		else {
			return false;
		}
  }
  checkDay(PESEL:any):boolean {
    var year = this.getBirthYear(PESEL);
		var month = this.getBirthMonth(PESEL);
		var day = this.getBirthDay(PESEL);
		if ((day >0 && day < 32) &&
			(month == 1 || month == 3 || month == 5 ||
			 month == 7 || month == 8 || month == 10 ||
			 month == 12)) {
			return true;
		} 
		else if ((day >0 && day < 31) &&
			(month == 4 || month == 6 || month == 9 ||
			 month == 11)) {
			return true;
		}
		else if ((day >0 && day < 30 && this.leapYear(year)) ||
				 (day >0 && day < 29 && !this.leapYear(year))) {
			return true;
		}
		else {
			return false;
		}
  }
  leapYear(year:any):any {
    if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)
			return true;
		else
		  return false;
	}
getBirthDay(PESEL:any):any {
    var day;
		day = 10 * PESEL[4];
		day += PESEL[5];
		return day;
  }
  getBirthYear(PESEL:any):any {
    var year;
		var month;
		year = 10 * PESEL[0];
		year += PESEL[1];
		month = 10 * PESEL[2];
		month += PESEL[3];
		if (month > 80 && month < 93) {
			year += 1800;
		}
		else if (month > 0 && month < 13) {
			year += 1900;
		}
		else if (month > 20 && month < 33) {
			year += 2000;
		}
		else if (month > 40 && month < 53) {
			year += 2100;
		}
		else if (month > 60 && month < 73) {
			year += 2200;
		}			
		return year;
  }
  getBirthMonth(PESEL:any):any {
    var month;
		month = 10 * PESEL[2];
		month += PESEL[3];
		if (month > 80 && month < 93) {
			month -= 80;
		}
		else if (month > 20 && month < 33) {
			month -= 20;
		}
		else if (month > 40 && month < 53) {
			month -= 40;
		}
		else if (month > 60 && month < 73) {
			month -= 60;
		}			
		return month;
	}
validateRegOn(regon):boolean {
    var valid = false;
    let isAllZero:boolean = true;
    if (regon.length == 9 || regon.length == 14) {
      var REGON = [];
      for(var i=0;i<regon.length;i++) {
          REGON[i]=parseInt(regon.substring(i,i+1));
          if(isAllZero && REGON[i] !== 0){
            isAllZero = false;
          }
      } 
      if(isAllZero){
        valid = false;	
      } else if (this.checkSumRegon(REGON)) {
				valid = true;
			}
			else {
				valid = false;	
			}   
      return valid;
    } else {
      return false;
    }
  }
  checkSumRegon(REGON:any):any {
    if (REGON.length == 9) {
			return this.checkSumRegon9(REGON);
		}
		else {
			return (this.checkSumRegon9(REGON) && this.checkSumRegon14(REGON));
		}
  }
 checkSumRegon9(REGON:any):any {
   var sum = 8 * REGON[0] + 
		         9 * REGON[1] +
             2 * REGON[2] +
             3 * REGON[3] +
             4 * REGON[4] +
             5 * REGON[5] +
             6 * REGON[6] +
             7 * REGON[7];
		sum %= 11;
		if (sum == 10) {
			sum = 0;
		}
		if (sum == REGON[8]) {
			return true;
		}
		else {
			return false;
		}
 }
 checkSumRegon14(REGON:any):any {
  var sum = 2 * REGON[0] + 
		        4 * REGON[1] +
            8 * REGON[2] +
            5 * REGON[3] +
            0 * REGON[4] +
            9 * REGON[5] +
            7 * REGON[6] +
            3 * REGON[7] +
            6 * REGON[8] +
            1 * REGON[9] +
            2 * REGON[10] +
            4 * REGON[11] +
            8 * REGON[12];
		sum %= 11;
		if (sum == 10) {
			sum = 0;
		}
		if (sum == REGON[13]) {
			return true;
		}
		else {
			return false;
		}
    }
    
    
}