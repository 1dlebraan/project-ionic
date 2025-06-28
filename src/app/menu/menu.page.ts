import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertService } from 'src/app/shared/altert/alert.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AntrianService } from '../services/antrian.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false,
})
export class MenuPage implements OnInit {
  showNotif: boolean = false;
  userName: string = 'Pasien';
  cekStatusSub!: Subscription;

  constructor(
    private alert: AlertService,
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private antrianService: AntrianService
  ) {}

  ngOnInit() {
    this.loadUserName();
  }


  async loadUserName() {
    try {
      const userDataString = localStorage.getItem('user_data');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        this.userName = userData?.name || 'Pasien';
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage', error);
      this.userName = 'Pasien';
    }
  }



  logoutConfirm() {
    this.alert.confirmLogout(() => {
      this.authService.logout().subscribe({
        next: () => {
          this.presentToast('Anda telah berhasil logout.', 'success');
          this.router.navigateByUrl('/login', { replaceUrl: true });
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Gagal logout. Silakan coba lagi.';
          this.presentToast(errorMessage);
          console.error('Logout error:', err);
          this.router.navigateByUrl('login', { replaceUrl: true });
        }
      });
    });
  }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    toast.present();
  }
}