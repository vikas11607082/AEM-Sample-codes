import { Directive, Component, ComponentFactory, OnChanges, OnInit, Input, ViewContainerRef, Compiler, ComponentFactoryResolver } from "@angular/core";
import { AppErrorDispatcher } from './apperrordispatcher.service';
import { CallPopUp } from './../popup/callcenterpopup.component';
import { ErrorPopUp } from './../popup/popup.component';
const typeMap = {
    'Backend': ErrorPopUp,
    'Validation': CallPopUp
  }
  
@Directive({
    selector: '[error-factory]'
})
export class ControlFactoryDirective implements OnInit {
    constructor(private apperrordispatcher: AppErrorDispatcher,private vcRef: ViewContainerRef, 
        private resolver: ComponentFactoryResolver) {
        
    }

    @Input() model: any;
    componentRef;
    init = false;

    
    ngOnInit() {
        this.apperrordispatcher.errorFound.subscribe(type => {
            const comp = typeMap[type]
            this.createComp(comp);
        })

        this.apperrordispatcher.closeErrorPopup.subscribe(value =>{
            this.destroyComp();
        })
    }
    createComp(comp) {
        const factory = this.resolver.resolveComponentFactory(comp);
        const compRef = this.vcRef.createComponent(factory);
    
        if (this.componentRef) {
          this.componentRef.destroy();
        }
    
        this.componentRef = compRef;
        this.init = true;

    }

    destroyComp(){
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }
}