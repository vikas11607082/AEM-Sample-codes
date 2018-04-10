import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DriverDetailsComponent, CarDetailsComponent, CarUsageComponent, LandingPageComponent, PolicyHolderComponent, ConfigurationComponent, NeedBasedComponent, ProductBundleComponent, CarOwnerDetailsComponent, ThankYouComponent } from './quote';
import { SummaryComponent } from './buy';
import { LoginComponent, OverviewComponent, DashboardComponent, PolicydetailsComponent } from './selfservice';
import { LoginRouteServices } from './util/login.router.service';
import { LoginOTPRouterServices } from './util/otplogin.router.service';
import { CCRouteService } from './callcenter/ccrouter.service'
import { CallCenterSearch } from './callcenter/callCenterSearch.component';
import { RestoreQuoteComponent } from './restorequote';
import { UrlRetrieveServices } from './restorequote';
import { CCUnauthorisedComponent } from './callcenter/unAuthorised.component';


const routes: Routes = [
  { path: '', redirectTo: '/cardetails', pathMatch: 'full' },
  { path: 'driverdetails', component: DriverDetailsComponent,canActivate: [LoginRouteServices] },
  { path: 'cardetails', component: CarDetailsComponent,canActivate: [UrlRetrieveServices] },
  { path: 'carusage', component: CarUsageComponent, canActivate: [LoginRouteServices] },
  { path: 'landingpage', component: LandingPageComponent,canActivate: [LoginRouteServices] },
  { path: 'policyholder', component: PolicyHolderComponent,canActivate: [LoginRouteServices] },
  { path: 'carownerdetails', component: CarOwnerDetailsComponent,canActivate: [LoginRouteServices] },
  { path: 'configuration', component: ConfigurationComponent,canActivate: [LoginRouteServices] },
  { path: 'needBased', component: NeedBasedComponent, canActivate: [LoginRouteServices] },
  { path: 'productbundle', component: ProductBundleComponent, canActivate: [LoginRouteServices] },
  { path: 'summary', component: SummaryComponent,canActivate: [LoginRouteServices] },
  { path: 'thankyou', component: ThankYouComponent},// canActivate: [LoginRouteServices] },
  { path: 'login', component: LoginComponent},// canActivate: [LoginRouteServices] },
  { path: 'overview', component: OverviewComponent},// canActivate: [LoginRouteServices] },
  { path: 'dashboard', component: DashboardComponent},// canActivate: [LoginRouteServices] },
  { path: 'callcentersearch', component: CallCenterSearch, canActivate: [CCRouteService]},
  { path: 'policydetails', component: PolicydetailsComponent,canActivate: [LoginOTPRouterServices] },
  { path: 'restore', component:RestoreQuoteComponent, canActivate: [UrlRetrieveServices]},
  { path: 'unauthoriseduser', component:CCUnauthorisedComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})


export class AppRoutingModule {

}
