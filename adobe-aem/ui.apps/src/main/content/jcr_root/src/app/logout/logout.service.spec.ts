import {LogoutService} from './logout.service';
import {async, inject, TestBed} from '@angular/core/testing';

describe ('LogoutService', () => {

    beforeAll(() => {
        TestBed.configureTestingModule({           
            providers: [{provide: LogoutService}]
        });
    });

    it('should emit true on call of show Logout', 
    async(
        inject([LogoutService], (logoutService: LogoutService) => {
            logoutService.confirmLogout.subscribe(data => {
                expect(data).toEqual(true);
            });
            logoutService.closeLogout.subscribe(data => {
                expect(data).toEqual(false);
            });
            logoutService.showLogoutConfirm(true);
            logoutService.closeLogoutPopup(false);
        })));
});