import { Component, OnInit, ViewChild, Input, Output, ElementRef } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'owner-details',
  templateUrl: './OwnerPersonalDetail.html'
})

export class OwnerPersonalDetail implements OnInit {

  constructor(private router: Router) { }

  @Input() Owner: any;
  @Input() fieldName: any;

  public showNameSurname: boolean = false;
  public showCompanyName: boolean = false;
  public showPesel: boolean = false;
  public showRegon: boolean = false;
  public showCompanyRegon: boolean = false;
  public showLeasing: boolean = false;
  public showBank: boolean = false;
  public showLeasingRegon: boolean = false;
  public showAndHideCarOwnerInfoFlag: any = 0;
  public showBankRegon: boolean = false;

  ngOnInit() {
    if (this.Owner.type == 'PrivatePerson') {
      this.showNameSurname = true;
      this.showPesel = true;
    }
    if (this.Owner.type == 'Company') {
      this.showNameSurname = false;
      this.showPesel = false;
      this.showCompanyName = true;
      this.showCompanyRegon = true;

    } if (this.Owner.type == 'SoleTrader') {
      this.showCompanyName = false;
      this.showNameSurname = true;
      this.showPesel = true;
      this.showRegon = true;
    }
    if (this.Owner.type == 'Leasing') {
      this.showLeasing = true;
      this.showLeasingRegon = true;
      this.showCompanyName = false;
      this.showNameSurname = false;
      this.showPesel = false;
    }
    if (this.Owner.type == 'Bank') {
      this.showBank = true;
      this.showBankRegon = true;
      this.showCompanyName = false;
      this.showNameSurname = false;
      this.showPesel = false;

    }
  }
  showAndHideCarOwnerInfo(ele: any): void {
    if (this.showAndHideCarOwnerInfoFlag == 0) {
      ele.classList.add("is-opened");
      this.showAndHideCarOwnerInfoFlag = 1;
    } else {
      ele.classList.remove("is-opened");
      this.showAndHideCarOwnerInfoFlag = 0;
    }
  }

  carOwnerEditOptions() {
    this.router.navigateByUrl('/carownerdetails');
  }







}
