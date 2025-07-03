import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/shared/altert/alert.service';
import { Router } from '@angular/router';
import { AntrianService } from 'src/app/services/antrian.service';

@Component({
  selector: 'app-status-antrian',
  templateUrl: './status-antrian.page.html',
  styleUrls: ['./status-antrian.page.scss'],
  standalone: false,
})
export class StatusAntrianPage implements OnInit, OnDestroy {
  antrian: any = null;
  loading = true;
  intervalId: any;

  constructor(
    private alert: AlertService,
    private router: Router,
    private antrianService: AntrianService
  ) {}

  ngOnInit() {
    this.loadStatusAntrian();
    this.startSmartPolling();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  logoutConfirm() {
    this.alert.confirmLogout(() => {
      console.log('User logged out');
      this.router.navigate(['/login']);
    });
  }

  startSmartPolling() {
    this.intervalId = setInterval(() => {
      this.antrianService.getStatusAntrian().subscribe({
        next: (res) => {
          // Kalau status antrian berubah, update & beri notifikasi
          if (this.antrian?.status_antrian !== res.antrian?.status_antrian) {
            this.antrian = res.antrian;
            this.alert.presentAlert(
              'Status Antrian Berubah',
              `Status antrian Anda kini: ${res.antrian.status_antrian}`
            );
          }

          // Hentikan polling kalau status sudah final
          if (['selesai', 'batal'].includes(res.antrian?.status_antrian)) {
            clearInterval(this.intervalId);
            this.intervalId = null;
          }
        },
        error: () => {
          this.alert.presentAlert('Error', 'Gagal mengambil status antrian');
        }
      });
    }, 5000);
  }

  loadStatusAntrian() {
    this.loading = true;
    this.antrianService.getStatusAntrian().subscribe({
      next: (res) => {
        this.antrian = res.antrian;
        this.loading = false;

        if (!res.status && res.antrian && res.antrian.status_antrian === 'batal') {
          this.alert.presentAlert(
            'Antrian Batal',
            'Antrian Anda telah dibatalkan karena tidak konfirmasi kehadiran.'
          );
        }
      },
      error: () => {
        this.alert.presentAlert('Error', 'Gagal mengambil status antrian');
        this.loading = false;
      }
    });
  }

  formatTanggal(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }
}
