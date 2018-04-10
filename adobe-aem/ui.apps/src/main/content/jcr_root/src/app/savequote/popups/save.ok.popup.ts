import { Component,OnInit } from '@angular/core';
import { SaveQuoteService } from './../quote.save.service';
import { AEMSet, AEMTrack } from '../../commons/analytics';

@Component({
    selector: 'save-ok-pop-up',
    templateUrl: './save.ok.popup.html'
})

export class SaveOkPopup implements OnInit {
    constructor(private _saveQuoteService:SaveQuoteService){}
    ngOnInit(){}
    
    
    saveConfirm(){
        this._saveQuoteService.closeSaveOkPopup();
        	/* ********************DO-NOT-TOUCH***************************************** */
            var saveClicked:true;
            console.log("####savecliked####"+saveClicked);
		/* Secondary Approach For Analytics - AEM integrated environment ---Starts here--*/
               AEMSet('digitalData.quote.saveQuote',saveClicked);
               AEMTrack('saveQuote');

		/* Secondary Approach For Analytics - AEM integrated environment ---Ends here-- */

		/* ************************DO-NOT-TOUCH****************************************** */

    }
}
