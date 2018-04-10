import { Component, OnInit } from '@angular/core';
import { DispatcherService } from '../commons/services/dispatcherservice';
import { CislService} from '../util/util.cisl.service';

@Component({
  selector: 'footer-root',
  templateUrl: './footer.component.html'
})

export class FooterComponent implements OnInit {
	
	constructor(private dispatcher: DispatcherService, private cislService: CislService ) {}


	versionInfo: any;

	ngOnInit():void {
		this.versionInfo = 'unknown';
		this.cislService.getSystemPingInfo().subscribe(x => this.initVersionInfo(x));
	}

	initVersionInfo(versionObj: any) {
		if (versionObj.dppVersion) {
			this.versionInfo = versionObj.dppVersion;
		} else if (versionObj.projectVersion) {
			this.versionInfo = versionObj.projectVersion;
		}
	}
	
  addClass(event):void{
 		event.target.classList.add('is-filled');
 	}
    removeClass(event):void{
  		if(event.target.classList.contains('ng-invalid')){
    	event.target.classList.remove('is-filled');
 		 }
	}
}