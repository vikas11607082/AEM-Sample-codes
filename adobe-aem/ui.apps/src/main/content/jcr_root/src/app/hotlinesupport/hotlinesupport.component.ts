import { Component } from '@angular/core';
import {AppComponent} from '../app.component';



@Component({
  selector: 'hotline-support',
  templateUrl: './hotlinesupport.component.html'
})
export class HotlineSupportComponent {

  removeClass(event): void {
        if (event.target.classList.contains('ng-invalid')) {
            event.target.classList.add('is-filled');
        }
    }

  addClass(event): void {
        event.target.classList.add('is-filled');

    }

}