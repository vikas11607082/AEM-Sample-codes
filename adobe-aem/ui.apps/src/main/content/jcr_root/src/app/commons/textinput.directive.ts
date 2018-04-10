import {Directive, ElementRef, OnInit, Renderer, OnChanges, Input } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    selector: "[dpp-input]",
    providers: [NgModel]
})

export class DppInputDirective implements OnChanges {
    @Input() public input: any;
    constructor(private el: ElementRef, private ngModel: NgModel, private renderer:Renderer){       
    }

    ngOnInit():any {
      
    } 

    ngAfterContentInit() {
        this.checkInputFiled();
      }
    ngOnChanges(){       
        this.checkInputFiled();
    }
    
    checkInputFiled(){                
        if(this.ngModel.model){           
            this.el.nativeElement.classList.add('is-filled');            
        } else {
            this.el.nativeElement.classList.remove('is-filled');
        }
    }

}