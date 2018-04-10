import {Component,ElementRef,Renderer,OnInit} from '@angular/core';


import { CislService} from '../util/util.cisl.service';

@Component({
  templateUrl: './overview.component.html'
})


export class OverviewComponent implements OnInit {

constructor(private cislService: CislService) { }
public name: string;
public otp: string;
public isOkClicked :boolean;
public buttonLabel:string;

 ngOnInit() {
       this.isOkClicked =false;
       this.name ="OK";
  } 
  
    public setOtp(otp:string){
        this.otp =otp;
    }
      
  public login(element,text){
      this.isOkClicked = true;
      this.buttonLabel ="Login";
 
  }

}