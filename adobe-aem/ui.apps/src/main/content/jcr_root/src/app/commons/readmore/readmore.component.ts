import { Component,OnInit,Input, Output,ElementRef,AfterViewInit,OnChanges  } from '@angular/core';

@Component({
    selector: 'read-more',
    templateUrl: './readmore.html'
})

export class ReadMore implements OnInit {

@Input() description:String;

public showMoreInfo:boolean=false;
public showLessInfo:boolean=false;
public storeText:String

ngOnInit(){
   if(this.description.length >200){
    this.storeText= this.description.slice(0,200);
    this.showMoreInfo=true;
    this.showLessInfo=false;
  }else {
  this.storeText= this.description;
  this.showMoreInfo=false;
  this.showLessInfo=false;
  }
 }


 clickMoreInfo(){
   this.storeText=this.description;
   this.showLessInfo=true;
   this.showMoreInfo=false;
 }

 clickLessInfo(){
   this.storeText= this.description.slice(0,200);
    this.showMoreInfo=true;
    this.showLessInfo=false;
 }
}