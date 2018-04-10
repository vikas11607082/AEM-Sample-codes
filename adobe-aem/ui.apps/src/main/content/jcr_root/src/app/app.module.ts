import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Renderer } from '@angular/core';
import { FormsModule, FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TranslatePipe, TranslateService } from './commons/translate';
import { TRANSLATION_PROVIDERS, TRANSLATIONS, dictionary } from './commons/translate';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HotlineSupportComponent } from './hotlinesupport/hotlinesupport.component';
import {
  DriverDetailsComponent, CarDetailsComponent, CarUsageComponent, LandingPageComponent, PolicyHolderComponent,
  ConfigurationComponent, NeedBasedComponent, ProductBundleComponent, CarOwnerDetailsComponent, ThankYouComponent
} from './quote';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

import { SummaryComponent } from './buy';
import { AppRoutingModule } from './app.routes';
import { ClickOutsideDirective } from './commons/clickoutside.directive';
import { DataTableModule } from "angular2-datatable";
import { HttpClientModule } from '@angular/common/http';
import { CustomFormsModule } from 'ng2-validation';
import { AppRestService } from './app.rest.service';
import { AppUrlService } from './app.url.service';
import { DppInputDirective } from './commons/textinput.directive';
import { TextValidationService } from './commons/services/quote.textvalidation.service';
import { PolicyHolderAddress } from './commons/address/address.component';
import { ErrorDivComponent } from './commons/error/errorDiv.component';
import { ValidationErrorPopup } from './commons/error/validationErrorPopup.component';
import { DropDown } from './commons/dropdown/dropdown.component';
import { CallPopUp } from './commons/popup/callcenterpopup.component';
import { ErrorPopUp } from './commons/popup/popup.component';
import { DispatcherService } from './commons/services/dispatcherservice';
import { CislService } from './util/util.cisl.service';
import { CustomUrlSerializer } from './commons/customurl/customUrlSerializer';
import { LoginComponent } from './selfservice/login.component';
import { OverviewComponent } from './selfservice/overview.component';
import { DashboardComponent } from './selfservice/dashboard.component';
import { PolicydetailsComponent } from './selfservice/policydetails.component';
import { OwnerPersonalDetail } from './commons/OwnerPersonalDetail/OwnerPersonalDetail.component';
import { ValidateService } from './commons/services/validate.service';
import { AppErrorHandler } from './commons/errorhandler/apperrorhandler';
import { AppErrorDispatcher } from './commons/errorhandler/apperrordispatcher.service';
import { ControlFactoryDirective } from './commons/errorhandler/errorfactory.directive';
import { FormSelectComponent } from './commons/formselect/form.select.component';
import { RadioIconGroupComponent } from './commons/radioicongroup/radio.icon.group';
import { StickDirective } from './commons/stickyElement/sticky.header.directive';
import { MarketingConsentsComponent } from './commons/marketingconsents/marketing.consents.component';
import { GoogleRecaptchaDirective } from './commons/googlerecaptcha.directive';
import { AuthLoginService } from './util/auth.login.service';
import { LoginRouteServices } from './util/login.router.service';
import { CCRouteService } from './callcenter/ccrouter.service';
import { API_BASE_URL, ApiBaseUrlFactory } from './commons/services/apibaseurl.config';
import { ImagePathResolverPipe } from './commons/image.path.pipe';
import { LoginOTPRouterServices } from './util/otplogin.router.service';
import { AuthOTPLoginService } from './util/auth.otplogin.service';
import { CamelCaseConvert } from './util/title.camel.case.service';
import { CallCenterSearch } from './callcenter/callCenterSearch.component';
import { PageNavigateService } from './callcenter/page.navigate';
import { SaveQuoteService } from './savequote/quote.save.service';
import { SaveEmailConsentPopup } from './savequote/popups/save.email.consent.popup';
import { SaveOkPopup } from './savequote/popups/save.ok.popup';
import { SaveButtonHideShowService } from './savequote/save.button.hide.show.service';
import { SaveQuotePageToEntityMappingService } from './savequote/quote.save.page.entity.mapping';
import { RestoreQuoteComponent } from './restorequote';
import { QuoteRestoreSecurityQuestion } from './restorequote/popups/quote.restore.security.question.popup';
import { SortPipe } from './callcenter/sorting.pipe';
import { ReadMore } from './commons/readmore/readmore.component';
import {AuthTokenInterceptor} from './commons/services/auth.token.interceptor';
import { RestoreQuoteSessionService } from './restorequote/quote.restore.session';
import {PolicyHolderSessionMapService } from './savequote/policyholder.save.session.map.service';
import { PolicyHolderPageDataDefinitionService } from './commons/services/policyholder.page.data.definition.service.';
import { PolicyHolderSessionRestoreService } from './restorequote/policyholder.restore.session.service';
import { QuoteRestoreOfferUnpaid } from './restorequote/popups/quote.restore.offer.unpaid.popup';
import { LogoutService } from './logout/logout.service';
import { QuoteRestoreOfferSendAgain } from './restorequote/popups/quote.restore.offer.send.again.popup';
import { QuoteRestoreExpired } from './restorequote/popups/quote.restore.expired.popup';
import { QuoteRestorePriceRecalculation } from './restorequote/popups/quote.restore.price.recalulation';
import { UrlRetrieveServices } from './restorequote';
import { MarketingConsentsComponentSavePopup } from './commons/marketingconsents/marketing.consents.save.popup.component';
import { LogoutComponent } from './logout/logout.component';
import { CCUnauthorisedComponent } from './callcenter/unAuthorised.component';

@NgModule({
  declarations: [
    AppComponent,
    TranslatePipe,
    HeaderComponent,
    FooterComponent,
    HotlineSupportComponent,
    DriverDetailsComponent,
    CarDetailsComponent,
    CarUsageComponent,
    LandingPageComponent,
    PolicyHolderComponent,
    ConfigurationComponent,
    NeedBasedComponent,
    ProductBundleComponent,
    SummaryComponent,
    CarOwnerDetailsComponent,
    ClickOutsideDirective,
    DppInputDirective,
    PolicyHolderAddress,
    ErrorDivComponent,
    ValidationErrorPopup,
    DropDown,
    ThankYouComponent,
    CallPopUp,
    ErrorPopUp,
    LoginComponent,
    OverviewComponent,
    DashboardComponent,
    OwnerPersonalDetail,
    PolicydetailsComponent,
    ControlFactoryDirective,
    FormSelectComponent,
    RadioIconGroupComponent,
    StickDirective,
    MarketingConsentsComponent,
    GoogleRecaptchaDirective,
    ImagePathResolverPipe,
    CallCenterSearch,
    SaveEmailConsentPopup,
    SaveOkPopup,
    RestoreQuoteComponent,
    QuoteRestoreSecurityQuestion,
    SortPipe,
    ReadMore,
    QuoteRestoreOfferUnpaid,
    QuoteRestoreOfferSendAgain,
    QuoteRestoreExpired,
    QuoteRestorePriceRecalculation,
    MarketingConsentsComponentSavePopup,
    LogoutComponent,
    CCUnauthorisedComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DataTableModule,
    HttpClientModule,
    CustomFormsModule,
    Ng2AutoCompleteModule
  ],


  providers: [TRANSLATION_PROVIDERS, FormBuilder, TranslateService, DispatcherService, ValidateService, AuthLoginService, LoginRouteServices,LoginOTPRouterServices,AuthOTPLoginService,PageNavigateService,
    CislService, AppRestService, AppUrlService, TextValidationService,CustomUrlSerializer,AppErrorDispatcher,CamelCaseConvert,SaveQuoteService,SaveButtonHideShowService,SaveQuotePageToEntityMappingService,
    RestoreQuoteSessionService, PolicyHolderSessionMapService,PolicyHolderPageDataDefinitionService,PolicyHolderSessionRestoreService,CCRouteService,UrlRetrieveServices,LogoutService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
    {provide: API_BASE_URL, useFactory: ApiBaseUrlFactory},
    {provide: 'Window', useValue: window},
    {provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
