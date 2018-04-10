import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Configuration } from './configuration';

import { AuthenticateService } from './api/authenticate.service';
import { CcloginService } from './api/cclogin.service';
import { ConsentService } from './api/consent.service';
import { ContactcenterService } from './api/contactcenter.service';
import { CustomerService } from './api/customer.service';
import { DocumentService } from './api/document.service';
import { DomainService } from './api/domain.service';
import { DomaindbService } from './api/domaindb.service';
import { PolicyService } from './api/policy.service';
import { QuotestoreService } from './api/quotestore.service';
import { SystemService } from './api/system.service';

@NgModule({
  imports:      [ CommonModule, HttpClientModule ],
  declarations: [],
  exports:      [],
  providers: [
    AuthenticateService,
    CcloginService,
    ConsentService,
    ContactcenterService,
    CustomerService,
    DocumentService,
    DomainService,
    DomaindbService,
    PolicyService,
    QuotestoreService,
    SystemService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        }
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import your base AppModule only.');
        }
    }
}
