import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    public router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    const token = await this.authService.getToken();
    if (token) {
      this.router.navigateByUrl('/menu', { replaceUrl: true });
    }
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

  async onLogin() {
    const loading = await this.loadingController.create({
      message: 'Sedang masuk...',
      spinner: 'crescent',
    });
    await loading.present();

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        loading.dismiss();
        this.presentToast('Login berhasil!', 'success');
        // Ganti '/home' dengan rute dashboard pasien Anda setelah login
        this.router.navigateByUrl('/menu', { replaceUrl: true });
      },
      error: (err) => {
        loading.dismiss();
        const errorMessage = err.error?.message || 'Terjadi kesalahan login.';
        this.presentToast(errorMessage);
        console.error('Login error:', err);
      },
    });
  }
}
