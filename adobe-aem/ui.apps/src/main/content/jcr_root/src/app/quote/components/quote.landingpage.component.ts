import { Component, OnInit} from '@angular/core';
import { TranslateService } from '../../commons/translate';

@Component({

  templateUrl: '../html/quote.landingpage.component.html'
 
})
export class LandingPageComponent implements OnInit {

  constructor(private translate: TranslateService) {}
  
  
  ngOnInit() {
    this.translate.use("en");
  }

  showPolish(): void {
    this.translate.use("pl");
  }
	
  showEnglish(): void {
    this.translate.use("en");
  }
 

addClass(event):void{
 event.target.classList.add('is-filled');
  //this.addClass1="";
 }

removeClass(event):void{
  
   if(event.target.classList.contains('ng-invalid')){
    event.target.classList.remove('is-filled');
  }
}

}
