import {Injectable, ErrorHandler, EventEmitter } from '@angular/core';
import { AppErrorDispatcher } from './apperrordispatcher.service';

    @Injectable()
    export class AppErrorHandler extends ErrorHandler {
        constructor(private appErrorDispatcher: AppErrorDispatcher) {
          super();
        }

        handleError(error) {
            this.appErrorDispatcher.catchAndDispatchError(error);
        }
    }
