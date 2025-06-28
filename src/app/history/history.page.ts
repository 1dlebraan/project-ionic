import { Component, OnInit } from '@angular/core';
import { AntrianService } from '../services/antrian.service';
import { ToastController } from '@ionic/angular';
import { AlertService } from 'src/app/shared/altert/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false,
})
export class HistoryPage implements OnInit {
  riwayatAntrian: any[] = [];

  constructor(
    private antrianService: AntrianService,
    private toastController: ToastController,
    private alert: AlertService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadRiwayat();
  }

  logoutConfirm() {
    this.alert.confirmLogout(() => {
      console.log('User logged out');
      this.router.navigate(['/login']);
    });
  }

  loadRiwayat() {
    this.antrianService.getHistoryAntrian().subscribe({
      next: (res) => {
        if (res.status) {
          this.riwayatAntrian = res.data;
        } else {
          this.showToast('Gagal memuat riwayat');
        }
      },
      error: (err) => {
        this.showToast('Terjadi kesalahan saat memuat riwayat');
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }
}
