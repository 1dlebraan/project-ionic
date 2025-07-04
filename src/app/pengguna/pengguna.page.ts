import { Component, OnInit } from '@angular/core';
import { AlertService } from '../shared/altert/alert.service';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pengguna',
  templateUrl: './pengguna.page.html',
  styleUrls: ['./pengguna.page.scss'],
  standalone: false,
})
export class PenggunaPage implements OnInit {
  userData: any = null; // Properti untuk menyimpan data pengguna dari API
  formattedTanggalLahir: string = 'N/A'; // Untuk menampilkan tanggal lahir yang diformat

  constructor(
    private alert: AlertService,
    private router: Router,
    private authService: AuthService,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadProfileData(); // Panggil metode untuk memuat data profil saat komponen diinisialisasi
  }

  /**
   * ✅ Memuat data profil pengguna dari AuthService.
   * Asumsi: AuthService.currentUserValue akan mengembalikan objek user yang sudah login,
   * dengan semua detail pendaftaran pasien tergabung langsung di objek user tersebut.
   */
  async loadProfileData() {
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      // ✅ PERUBAHAN: Akses properti NIK, tempat_lahir, dll. langsung dari currentUser
      this.userData = {
        name: currentUser.name,
        email: currentUser.email,
        nik: currentUser.nik || 'N/A', // Akses langsung
        tempat_lahir: currentUser.tempat_lahir || 'N/A', // Akses langsung
        tanggal_lahir: currentUser.tanggal_lahir, // Akses langsung (tanggal mentah dari DB)
        jenis_kelamin: currentUser.jenis_kelamin || 'N/A', // Akses langsung
        no_hp: currentUser.no_hp || 'N/A', // Akses langsung
        alamat: currentUser.alamat || 'N/A', // Akses langsung
      };

      // Format tanggal lahir
      if (this.userData.tanggal_lahir) {
        try {
          const date = new Date(this.userData.tanggal_lahir);
          this.formattedTanggalLahir = date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        } catch (e) {
          console.error('Error formatting tanggal_lahir:', e);
          this.formattedTanggalLahir = 'Format Tanggal Invalid';
        }
      }
    } else {
      // Jika tidak ada user yang login, arahkan ke halaman login
      this.presentToast(
        'Anda belum login. Silakan login terlebih dahulu.',
        'danger'
      );
      this.navCtrl.navigateRoot('/login'); // Menggunakan navigateRoot agar tidak bisa kembali dengan tombol back
    }
  }

  /**
   * ✅ Menampilkan toast message.
   * @param message Pesan yang akan ditampilkan.
   * @param color Warna toast (misal: 'success', 'danger', 'warning').
   */
  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    toast.present();
  }

  logoutConfirm() {
    this.alert.confirmLogout(() => {
      this.authService.logout().subscribe({
        next: () => {
          this.presentToast('Anda telah berhasil logout.', 'success');
          this.router.navigateByUrl('/login', { replaceUrl: true });
        },
        error: (err) => {
          const errorMessage =
            err.error?.message || 'Gagal logout. Silakan coba lagi.';
          this.presentToast(errorMessage);
          console.error('Logout error:', err);
          this.router.navigateByUrl('/login', { replaceUrl: true });
        },
      });
    });
  }

  editProfile() {
    this.router.navigate(['/edit-profile']); // Ganti dengan rute halaman edit profil Anda
  }
}
