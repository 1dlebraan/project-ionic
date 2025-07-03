import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-pw',
  templateUrl: './reset-pw.page.html',
  styleUrls: ['./reset-pw.page.scss'],
  standalone: false,
})
export class ResetPwPage implements OnInit {
  email = '';
  password = '';
  password_confirmation = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {}

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }

  async resetPassword() {
    if (!this.email || !this.password || !this.password_confirmation) {
      this.showToast('Semua field wajib diisi', 'danger');
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.showToast('Format email tidak valid', 'danger');
      return;
    }

    if (this.password !== this.password_confirmation) {
      this.showToast('Konfirmasi password tidak cocok', 'danger');
      return;
    }

    this.loading = true;
    const loader = await this.loadingController.create({
      message: 'Memproses...',
    });
    await loader.present();

    this.authService.resetPassword(this.email, this.password, this.password_confirmation)
      .subscribe({
        next: async (res) => {
          await loader.dismiss();
          this.loading = false;
          await this.showToast(res.message || 'Password berhasil direset', 'success');
          this.clearForm();
          this.router.navigate(['/login']);
        },
        error: async (err) => {
          await loader.dismiss();
          this.loading = false;
          const msg = err.error?.message || 'Reset password gagal';
          await this.showToast(msg, 'danger');
        }
      });
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  clearForm() {
    this.email = '';
    this.password = '';
    this.password_confirmation = '';
  }

  goToLogin() {
  this.router.navigate(['/login']);
}

}
