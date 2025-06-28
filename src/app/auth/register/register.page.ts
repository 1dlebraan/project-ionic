import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false, // Sesuaikan dengan konfigurasi Ionic Anda
})
export class RegisterPage implements OnInit {
  // Properti untuk data login
  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  nik = '';
  tempat_lahir = '';
  tanggal_lahir: string = ''; // Tanggal dari ion-datetime akan berupa string ISO 8601
  jenis_kelamin: string = '';
  alamat = ''; // Tambahan untuk alamat

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  // Handler untuk ion-datetime agar nilai tanggal_lahir terformat dengan benar (YYYY-MM-DD)
  onTanggalLahirChange(event: any) {
    if (event.detail.value) {
      // Pastikan format yang dikirim ke backend adalah YYYY-MM-DD
      this.tanggal_lahir = new Date(event.detail.value)
        .toISOString()
        .split('T')[0];
    } else {
      this.tanggal_lahir = '';
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

  async onRegister() {
    if (this.password !== this.password_confirmation) {
      this.presentToast('Konfirmasi password tidak cocok!');
      return;
    }
    if (
      !this.name ||
      !this.email ||
      !this.password ||
      !this.password_confirmation ||
      !this.nik ||
      !this.tempat_lahir ||
      !this.tanggal_lahir ||
      !this.jenis_kelamin 
    ) {
      this.presentToast('Harap lengkapi semua bidang yang wajib diisi.');
      return;
    }

    if (
      this.jenis_kelamin !== 'Laki-Laki' &&
      this.jenis_kelamin !== 'Perempuan'
    ) {
      this.presentToast('Jenis Kelamin harus "Laki-Laki" atau "Perempuan".');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Sedang mendaftar...',
      spinner: 'crescent',
    });
    await loading.present();

    // ✅ Kirim semua data yang diperlukan ke AuthService
    this.authService
      .register(
        this.name,
        this.email,
        this.password,
        this.password_confirmation,
        this.nik,
        this.tempat_lahir,
        this.tanggal_lahir, // Pastikan formatnya sudah YYYY-MM-DD
        this.jenis_kelamin as 'Laki - Laki' | 'Perempuan',
        this.alamat
      )
      .subscribe({
        next: (res) => {
          loading.dismiss();
          this.presentToast('Registrasi berhasil! Silakan login.', 'success');
          this.router.navigateByUrl('/login', { replaceUrl: true }); // Arahkan ke halaman login
        },
        error: (err) => {
          loading.dismiss();
          let errorMessage = 'Terjadi kesalahan saat registrasi.';
          if (err.error && err.error.errors) {
            errorMessage = Object.values(err.error.errors)
              .map((messages: any) => messages.join(' '))
              .join('. ');
          } else if (err.error && err.error.message) {
            errorMessage = err.error.message;
          }
          this.presentToast(errorMessage);
          console.error('Registration error:', err);
        },
      });
  }
}
