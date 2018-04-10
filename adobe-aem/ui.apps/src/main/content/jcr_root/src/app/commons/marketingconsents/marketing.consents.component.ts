import { Component, Renderer ,ViewChild, ElementRef, AfterViewInit, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
	selector:'marketing-consents',
    templateUrl: './marketing.consents.component.html',
})


export class MarketingConsentsComponent implements OnChanges {
	@Input() consentsArray= [];
	@Input() selectedAll:boolean = false;
	@Input() page:string;
	@Input() nextClicked:boolean;
	@Output() onDataPicked: EventEmitter<any> = new EventEmitter<any>();	
	public consentsId:string = 'AZONLINE_CARUSAGE';
	public consentsArr = [];
	public selectedAllConsent: boolean;
	public subQuestionsFlag=[];
	public checkFlag:boolean;
	public typeFlag:number = 0;
	public answers = [];
    ngOnInit(){
		
	}
	ngOnChanges() {		
		this.consentsArr = this.consentsArray;
		this.selectedAllConsent = this.selectedAll;
		this.page = this.page;
		if(this.consentsArr !== undefined){
			this.serializeMarketingConsents();
		}
		this.consentsArr = this.checkMandatoryConsents();
	}
	checkMandatoryConsents():any{
		for(let i = 0; i<this.consentsArr.length;i++){
			if(this.consentsArr[i].subQuestions!=undefined){
				for(let j=0; j<this.consentsArr[i].subQuestions.length;j++){
					if(this.consentsArr[i].subQuestions[j].answerObligationType==='mandatory'){
						if(this.consentsArr[i].subQuestions[j].answer != undefined) {
							if(this.consentsArr[i].subQuestions[j].answer.value===false){
								this.checkFlag = false;
								this.consentsArr[i].subQuestions[j]['showError'] = true;
								//console.log(this.consentsArr[i].subQuestions[j]);
							}else{
								this.consentsArr[i].subQuestions[j]['showError'] = false;
							}
						}						
					} else {
						this.consentsArr[i].subQuestions[j]['showError'] = false;
					}						
				}	
			} else {
				if(this.consentsArr[i].answerObligationType==='mandatory'){
						if(this.consentsArr[i].answer != undefined) {
							if(this.consentsArr[i].answer.value===false){
								this.checkFlag = false;
								this.consentsArr[i]['showError']=true;
								//console.log(this.consentsArr[i]);
							}else {
								this.consentsArr[i]['showError']=false;
							}
						}						
					} else {
						this.consentsArr[i]['showError']=false;	
					}
			}	
		}
		return this.consentsArr;
	}
    /**Marketing consents start */
	serializeMarketingConsents(){	
		for(let i=0; i<this.consentsArr.length;i++){		
			this.checkTypeFlag(this.consentsArr[i], i);
			if(this.consentsArr[i].subQuestions!=null){
				this.subQuestionsFlag[i] = true;				
			} else {
				this.subQuestionsFlag[i] = false;					
			}	
		}
		this.sendData()
	}
	checkTypeFlag(data, index){
		if(data.answer != undefined){
			this.typeFlag += 1;
			this.answers[index]=true;
		}else {
			this.typeFlag += 0;
			this.answers[index]=false;
		}
	}
	selectAllConsent(){
		for(let i=0; i<this.consentsArr.length;i++){
			if(this.consentsArr[i].subQuestions!=null){
				this.consentsArr[i].answer.value=this.selectedAllConsent;
				for(let j=0; j<this.consentsArr[i].subQuestions.length;j++){
					if(this.consentsArr[i].subQuestions[j].answer != undefined){
						this.consentsArr[i].subQuestions[j].answer.value=this.selectedAllConsent;	
					}					
				}				
			} else {
				if(this.consentsArr[i].answer != undefined) {
					this.consentsArr[i].answer.value=this.selectedAllConsent;	
				}
			}	
		}
		console.log(this.consentsArr);
		this.sendData();
	}
	selectConsent(){
		this.consentsArr = this.checkMandatoryConsents();
		this.selectedAllConsent = this.consentsArr.every(function (item: any) {
			if(item.subQuestions!=null){
				return ((item.subQuestions.every(function (innnerItem: any) {
					if(innnerItem.answer != undefined) {
						return innnerItem.answer.value === true;	
					}else {
						return true;	
					}					
				})) && (item.answer != undefined?(item.answer.value === true):(true)))
			} else {
				return (item.answer != undefined?(item.answer.value === true):(true));
			}
   		})
		this.sendData();
	}
	selectAllSubConsent(index:number){		
		for(let i=0; i<this.consentsArr[index].subQuestions.length;i++){
			if(this.consentsArr[index].subQuestions[i].answer != undefined) {
				this.consentsArr[index].subQuestions[i].answer.value=this.consentsArr[index].answer.value;	
			}			
		}
		this.selectedAllConsent = this.consentsArr.every(function (item: any) {
			if(item.subQuestions!=null){
				return ((item.subQuestions.every(function (innnerItem: any) {
					return (innnerItem.answer != undefined?(innnerItem.answer.value === true):(true));	
				})) && (item.answer != undefined?(item.answer.value === true):(true)))
			} else {
				return (item.answer != undefined?(item.answer.value === true):(true));
			}
		})
		this.sendData();
	}
	selectSubConsent(index:number){
		this.consentsArr = this.checkMandatoryConsents();
		if(this.consentsArr[index].answer != undefined) {
			this.consentsArr[index].answer.value = this.consentsArr[index].subQuestions.every(function (item: any) {
				return (item.answer != undefined?(item.answer.value === true):(true));
			})
		}	
		this.selectedAllConsent = this.consentsArr.every(function (item: any) {
			if(item.subQuestions!=null){
				return ((item.subQuestions.every(function (innnerItem: any) {
					return (innnerItem.answer != undefined?(innnerItem.answer.value === true):(true));	
				})) && (item.answer != undefined?(item.answer.value === true):(true)))
			} else {
				return (item.answer != undefined?(item.answer.value === true):(true));
			}
		})
		this.sendData();
	}
	checkMarketingMandatory():boolean{
		this.checkFlag = true;
		if(this.consentsArr==undefined || this.consentsArr == null){
			this.checkFlag = false;
			return this.checkFlag;
		}
		for(let i = 0; i<this.consentsArr.length;i++){
			if(this.consentsArr[i].subQuestions!=null){
				for(let j=0; j<this.consentsArr[i].subQuestions.length;j++){
					if(this.consentsArr[i].subQuestions[j].answerObligationType==='mandatory'){
						if(this.consentsArr[i].subQuestions[j].answer != undefined) {
							if(this.consentsArr[i].subQuestions[j].answer.value===false){
								this.checkFlag = false;
								break;
							}
						}						
					}						
				}	
			} else {
				if(this.consentsArr[i].answerObligationType==='mandatory'){
						if(this.consentsArr[i].answer != undefined) {
							if(this.consentsArr[i].answer.value===false){
								this.checkFlag = false;
								break;
							}
						}						
					}	
			}	
		}
		/*if(checkFlag==true){
			this.isNextDisable = false;
		} else {
			this.isNextDisable = true;
		}*/	
		return this.checkFlag;	
	}
	sendData(){
		// let obj = {"IsConsentValid":this.checkMarketingMandatory(), "ConsentArray":this.consentsArr, "SelectedAllConsents":this.selectedAllConsent};
		let obj = {"IsConsentValid":this.checkMarketingMandatory(), "ConsentArray":this.consentsArr, "SelectedAllConsents":this.selectedAllConsent};
		this.onDataPicked.emit(obj);
		
	}

 /*Added for tooltip*/
    addClassTooltip(tooltip, tooltippopup, event): void {
        tooltip.classList.add('has-open-tooltip');
        tooltip.setAttribute("aria-expanded", "true");
        tooltippopup.setAttribute("aria-hidden", "true");
        tooltippopup.classList.add('is-open');
        event.preventDefault();
    }
    removeClassTooltip(tooltip, tooltippopup, event): void {
        tooltip.classList.remove('has-open-tooltip');
        tooltip.setAttribute("aria-expanded", "false");
        tooltippopup.setAttribute("aria-hidden", "false");
        tooltippopup.classList.remove('is-open');
        event.preventDefault();
    }
	/* End for end */
}
