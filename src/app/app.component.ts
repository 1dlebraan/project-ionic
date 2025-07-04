import { Component, OnDestroy, OnInit } from '@angular/core';
import { AntrianService } from './services/antrian.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  showGlobalNotif: boolean = false;
  notifSub!: Subscription;
  userSub!: Subscription;

  constructor(
    private antrianService: AntrianService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Pantau status login (currentUser)
    this.userSub = this.authService.currentUser.subscribe(user => {
      if (user) {
        // User login, mulai polling
        this.antrianService.startPollingStatus();
        if (!this.notifSub) {
          this.notifSub = this.antrianService.notif$.subscribe(() => {
            this.showGlobalNotif = true;
          });
        }
      } else {
        // User logout, stop polling
        this.antrianService.stopPollingStatus();
        if (this.notifSub) {
          this.notifSub.unsubscribe();
          this.notifSub = undefined!;
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.notifSub) {
      this.notifSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    this.antrianService.stopPollingStatus();
  }

  closeGlobalNotif() {
    this.showGlobalNotif = false;
  }
}
