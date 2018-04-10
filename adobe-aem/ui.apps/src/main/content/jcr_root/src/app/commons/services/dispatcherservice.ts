import {Inject, Injectable, Optional} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {API_BASE_URL} from './apibaseurl.config';
import {
  AuthenticateService,
  BASE_PATH,
  Configuration,
  ConsentService,
  CustomerService,
  DocumentService,
  DomainService,
  PolicyService,
  SystemService
} from '../../../generated/index';

@Injectable()
export class DispatcherService {
  public domain: DomainService;
  public system: SystemService;
  public consent: ConsentService;
  public customer: CustomerService;
  public policy: PolicyService;
  public document: DocumentService;
  public authenticate: AuthenticateService;

  constructor(http: HttpClient, @Optional() @Inject(BASE_PATH) baseUrl?: string, @Optional() @Inject(API_BASE_URL) apiBaseUrl?: string) {
    if (!baseUrl) {
      baseUrl = environment.dispatcherBaseUrl;
    }
    if (!baseUrl) {
      baseUrl = '/.';
    }
    const config = new Configuration();
    this.domain = new DomainService(http, baseUrl, config);
    this.system = new SystemService(http, baseUrl, config);
    this.consent = new ConsentService(http, baseUrl, config);
    this.customer = new CustomerService(http, baseUrl, config);
    this.policy = new PolicyService(http, baseUrl, config);
    this.document = new DocumentService(http, baseUrl, config);
    this.authenticate = new AuthenticateService(http, baseUrl, config);
  }

}
