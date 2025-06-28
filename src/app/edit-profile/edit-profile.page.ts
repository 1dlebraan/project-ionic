import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ToastController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: false,
})
export class EditProfilePage implements OnInit {
  // Properti untuk menyimpan data pengguna yang akan diedit
  // Inisialisasi dengan nilai default yang sesuai atau null/undefined
  userData: UserProfile | null = null;
  newPassword = '';
  confirmNewPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private navCtrl: NavController // Untuk navigasi yang lebih baik
  ) {}

  ngOnInit() {
    this.loadProfileData();
  }

  /**
   * Memuat data profil pengguna saat ini dari AuthService.
   * Data ini akan digunakan untuk mengisi form edit profil.
   */
  async loadProfileData() {
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      // ✅ Penting: Pastikan userData diinisialisasi dengan struktur yang benar
      // Menggunakan spread operator untuk membuat salinan data agar perubahan di form
      // tidak langsung memengaruhi currentUserSubject sebelum disimpan.
      this.userData = {
        name: currentUser.name,
        email: currentUser.email,
        nik: currentUser.nik || '',
        tempat_lahir: currentUser.tempat_lahir || '',
        tanggal_lahir: currentUser.tanggal_lahir
          ? new Date(currentUser.tanggal_lahir).toISOString().split('T')[0]
          : '',
        jenis_kelamin: currentUser.jenis_kelamin || '',
        alamat: currentUser.alamat || '',
      };
    } else {
      // Jika tidak ada user yang login, arahkan ke halaman login
      this.presentToast(
        'Anda belum login. Silakan login terlebih dahulu.',
        'danger'
      );
      this.navCtrl.navigateRoot('/auth/login');
    }
  }

  /**
   * Mengatur nilai tanggal_lahir saat ion-datetime berubah.
   * Memastikan format yang dikirim ke backend adalah YYYY-MM-DD.
   * @param event Event dari ion-datetime
   */
  onTanggalLahirChange(event: any) {
    if (this.userData) {
      if (event.detail.value) {
        this.userData.tanggal_lahir = new Date(event.detail.value)
          .toISOString()
          .split('T')[0];
      } else {
        this.userData.tanggal_lahir = ''; // Kosongkan jika tanggal dihapus
      }
    }
  }

  /**
   * Menampilkan toast message.
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

  /**
   * Handler saat tombol "Simpan Perubahan" diklik.
   * Melakukan validasi dan mengirim data ke AuthService.
   */
  async onSaveProfile() {
    if (!this.userData) {
      this.presentToast('Data profil belum dimuat.');
      return;
    }

    // Validasi password baru jika diisi
    if (this.newPassword || this.confirmNewPassword) {
      if (this.newPassword.length < 8) {
        this.presentToast('Password baru minimal 8 karakter.');
        return;
      }
      if (this.newPassword !== this.confirmNewPassword) {
        this.presentToast('Konfirmasi password baru tidak cocok!');
        return;
      }
    }

    // Validasi bidang yang wajib diisi
    if (
      !this.userData.name ||
      !this.userData.email ||
      !this.userData.nik ||
      !this.userData.tempat_lahir ||
      !this.userData.tanggal_lahir ||
      !this.userData.jenis_kelamin
    ) {
      this.presentToast(
        'Harap lengkapi semua bidang yang wajib diisi.',
        'warning'
      );
      return;
    }

    // Validasi Jenis Kelamin
    if (
      this.userData.jenis_kelamin !== 'Laki-Laki' &&
      this.userData.jenis_kelamin !== 'Perempuan'
    ) {
      this.presentToast(
        'Jenis Kelamin harus "Laki-Laki" atau "Perempuan".',
        'warning'
      );
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Menyimpan perubahan...',
      spinner: 'crescent',
    });
    await loading.present();

    // Buat objek data yang akan dikirim ke API
    const profileData = {
      name: this.userData.name,
      email: this.userData.email,
      nik: this.userData.nik,
      tempat_lahir: this.userData.tempat_lahir,
      tanggal_lahir: this.userData.tanggal_lahir,
      jenis_kelamin: this.userData.jenis_kelamin as 'Laki-Laki' | 'Perempuan',
      alamat: this.userData.alamat?.trim() || null,

      // Tambahkan password hanya jika ada perubahan
      ...(this.newPassword && {
        password: this.newPassword,
        password_confirmation: this.confirmNewPassword,
      }),
    };

    this.authService.updateProfile(profileData).subscribe({
      next: (res) => {
        loading.dismiss();
        this.presentToast('Profil berhasil diperbarui!', 'success');
        this.router.navigateByUrl('/pengguna', { replaceUrl: true }); // Kembali ke halaman profil
      },
      error: (err) => {
        loading.dismiss();
        let errorMessage = 'Terjadi kesalahan saat memperbarui profil.';
        if (err.error && err.error.errors) {
          errorMessage = Object.values(err.error.errors)
            .map((messages: any) => messages.join(' '))
            .join('. ');
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }
        this.presentToast(errorMessage);
        console.error('Update profile error:', err);
      },
    });
  }

  /**
   * Handler saat tombol "Batal" diklik.
   * Kembali ke halaman profil tanpa menyimpan perubahan.
   */
  onCancelEdit() {
    this.router.navigateByUrl('/pengguna', { replaceUrl: true });
  }

  /**
   * Handler untuk konfirmasi logout (dari header).
   */
  async logoutConfirm() {
    const loading = await this.loadingController.create({
      message: 'Logging out...',
      spinner: 'crescent',
    });
    await loading.present();

    this.authService.logout().subscribe({
      next: () => {
        loading.dismiss();
        this.presentToast('Anda telah berhasil logout.', 'success');
        this.router.navigateByUrl('/auth/login', { replaceUrl: true });
      },
      error: (err) => {
        loading.dismiss();
        const errorMessage =
          err.error?.message || 'Gagal logout. Silakan coba lagi.';
        this.presentToast(errorMessage);
        console.error('Logout error:', err);
        this.router.navigateByUrl('/auth/login', { replaceUrl: true });
      },
    });
  }
}

// Antarmuka untuk UserProfile agar data lebih terstruktur
export interface UserProfile {
  name: string;
  email: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string; // Format YYYY-MM-DD
  jenis_kelamin: 'Laki-Laki' | 'Perempuan' | string; // Bisa juga menggunakan enum jika ada
  alamat: string;
}
