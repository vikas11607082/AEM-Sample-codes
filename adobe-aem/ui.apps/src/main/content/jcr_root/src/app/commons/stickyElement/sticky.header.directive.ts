import {HostListener, Directive, ElementRef, Input, OnChanges, OnInit} from "@angular/core";

@Directive({
    selector: '[sticky-header]'    
})

export class StickDirective implements OnInit {
    @Input() public header:any;
    @Input() public footer:any;
    constructor(public element: ElementRef) {        
      
    }

    ngOnInit(){
        window.addEventListener('scroll', (e) => {                  
            if (this.getCoords(this.header) <= 0) {
               this.element.nativeElement.classList.add('stick');
               this.element.nativeElement.classList.remove('hide');
            } else {
               this.element.nativeElement.classList.remove('stick');
               this.element.nativeElement.classList.add('hide');
            }

            if(this.getCoordsFooter(this.footer)<=0){
                this.element.nativeElement.classList.add('hide');
            }
        });    
        
    }

    getCoords(element) {         
        return (element.offsetTop - window.pageYOffset);        
    }

    getCoordsFooter(element){        
        return( ((element.offsetTop + (element.clientHeight - 40)) - window.pageYOffset));         
    }
 }