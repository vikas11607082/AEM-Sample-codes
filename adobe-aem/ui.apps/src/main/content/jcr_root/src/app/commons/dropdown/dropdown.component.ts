import { Component,OnInit, Input, Output, EventEmitter  } from '@angular/core';

@Component({
    selector: 'drop-down',
     templateUrl: './dropdown.html'
})

export class DropDown implements OnInit {
@Input() dropDownName:string;
@Input() placeholder:string;
@Input() dropDownItems:any;
@Output() onDataPicked: EventEmitter<any> = new EventEmitter<any>();
@Input() previousSelectd:number;


public refDropDown:any;
public refUl:any;
public refArrow:any;
public isVisible:string;
private yy : number;
private selectedVal = "";


    ngOnInit(){       
       this.refDropDown = 'ref'+ this.dropDownName;
       this.refUl = 'refUl'+ this.dropDownName;
       this.refArrow = 'refArrow'+ this.dropDownName;

        var today = new Date();
        this.yy = today.getFullYear();
        if(this.previousSelectd !== undefined){
        this.selectedVal = String(this.previousSelectd);
        }

    }

    openDropDown(event,ele:any, eleUl:any, eleArrow:any){
        if(this.dropDownItems.length <= 0){
            return;
        }       
        if(eleUl.classList.contains("is-visible")){
            this.hideDropDown(event,ele,eleUl,eleArrow,this.placeholder);            
        } else {
            eleUl.classList.add("is-open");
            eleUl.classList.add("is-visible");
            eleUl.style.visibility =  "visible";           
            eleArrow.classList.add("c-icon--chevron-down");
            eleArrow.classList.add("is-open");
        }
        
    }

    hideDropDown(event,ele:any, eleUl:any, eleArrow:any, val:string){           
            eleUl.classList.remove("is-open");
            eleUl.classList.remove("is-visible");
            eleUl.style.visibility =  "hidden";            
            eleArrow.classList.add("c-icon--chevron-up");
            eleArrow.classList.remove("is-open");
            event.stopPropagation(); 
            this.onDataPicked.emit(val);           
       
    }     
}

