import { Component,OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CislService } from '../../util/util.cisl.service';
import {environment} from '../../../environments/environment';


@Component({
    selector: 'quote-restore-security-question',
    templateUrl: './quote.restore.security.question.popup.html'
})

export class QuoteRestoreSecurityQuestion implements OnInit {
    constructor( private cisiService:CislService){}
    @Input() quoteId:string;
    @Input() email:string;
    @Input() pageSaved:any;
    @Output() onValidAnswers: EventEmitter<any> = new EventEmitter<any>();
    public carBrandList:any;
    public carBrandPlaceholder:string;
    public questionArray = [];
    public firstRegistrationDate: '';
    public buildYear:'';
    public vehicleBrand:'';
    public licensePlateNumber:'';
    private currentPage = 2;
    private totalQuestions = 3;
    private questions = ['buildYear','vehicleBrand','firstRegistrationDate','licensePlateNumber'];//['firstRegistrationDate','buildYear','vehicleBrand','licensePlateNumber'];
    public showError:boolean = false;
    public disabledRestore:boolean = false;
    
    ngOnInit(){
        //this.currentPage = this.pageSaved;     
        this.generateRandomQuestions();        
    }

    private generateRandomNumber():Number{
       return Math.floor(Math.random() *  this.totalQuestions) + 1
    }

    private generateRandomQuestions(){
        if(this.currentPage >= 7){
            this.totalQuestions = 4;
        };

        if(this.currentPage >=3 && this.currentPage < 7) {
            this.totalQuestions = 3;
        };

        do{
            let questionNumber = this.generateRandomNumber();
            if(this.questionArray.length == 1){
                if(this.questionArray[0] !== questionNumber){
                    this.questionArray.push(questionNumber);
                }
            } else {
                this.questionArray.push(questionNumber);
            }
        }while(this.questionArray.length < 2);
    }

    public closeSecurityPopup(){
        window.location.href = environment.retrievePopupCloseUrl;
    }

    public recoverQuotation(){
        let answers = [];
        let obj = {};
        this.disabledRestore = true;
        this.showError = false;
        for(let i=0; i<this.questionArray.length;i++){  
            let index = this.questionArray[i] - 1;
            let questionAttr =  this.questions[index];
            obj[questionAttr] = this[questionAttr] == undefined ? "" : this[questionAttr];
        }        
        obj['email'] = this.email;
        obj['quoteId'] = String(this.quoteId);

        console.log(obj);
        this.validateAnswers(obj);

    }

    private validateAnswers(obj){     
       this.cisiService.validateSecurityQuestions(obj).subscribe(data => {this.validateSecurityQuestionSuccess(data)});      
    }

    private validateSecurityQuestionSuccess(data){        
        if(data){
            this.onValidAnswers.emit(data);
        } else {
            this.showError = true;
            this.disabledRestore = false;
        }
    }

   public acceptOnlyNumbers(event) {
    let k = event.charCode;
    let val = false;
    if ((k >= 48 && k <= 57 || k == 32 || k == 8 || k == 0) || (k == 118 && event.keyCode == 0)) {
      return;
    } else {
      return val;
    }
  } 
} 