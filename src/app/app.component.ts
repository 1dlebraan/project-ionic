import { Component, OnDestroy, OnInit } from '@angular/core';
import { AntrianService } from './services/antrian.service';
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

  constructor(private antrianService: AntrianService) {}

  ngOnInit() {
    // Start polling saat app dimulai
    this.antrianService.startPollingStatus();

    // Subscribe untuk notifikasi global
    this.notifSub = this.antrianService.notif$.subscribe(() => {
      this.showGlobalNotif = true;
    });
  }

  ngOnDestroy() {
    if (this.notifSub) {
      this.notifSub.unsubscribe();
    }
    this.antrianService.stopPollingStatus();
  }

  closeGlobalNotif() {
    this.showGlobalNotif = false;
  }
}
