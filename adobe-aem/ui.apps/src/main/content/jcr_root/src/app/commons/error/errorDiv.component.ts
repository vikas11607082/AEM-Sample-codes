import { Component, OnInit, Input, Output, EventEmitter, ViewChild,ElementRef} from "@angular/core";
import { errorMsgs} from './errorMessages';

@Component({
    selector:'error',
    templateUrl:'./errorDiv.component.html'
})

export class ErrorDivComponent implements OnInit {
    @ViewChild('errorPara') errorPara: ElementRef;
    @Input() showError:boolean;
    @Input() errorMsg:string;

    constructor(){}
    ngOnInit() {
        this.errorMsg=errorMsgs[this.errorMsg];   
    }   

}