import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/altert/alert.service';
import { AntrianService } from 'src/app/services/antrian.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pilih-poli',
  templateUrl: './pilih-poli.page.html',
  styleUrls: ['./pilih-poli.page.scss'],
  standalone: false,
})
export class PilihPoliPage implements OnInit {
  selectedPoliId: number | null = null;
  selectedDate: string = '';
  selectedJadwal: any = null;
  selectedJam: string = '';

  poliList: any[] = [];
  tanggalTersedia: any[] = [];
  sesiList: any[] = [];
  jamTersedia: string[] = [];

  constructor(
    private router: Router,
    private alert: AlertService,
    private antrianService: AntrianService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  ionViewWillEnter() {
    this.loadPoli();
  }

  logoutConfirm() {
    this.alert.confirmLogout(() => {
      this.router.navigate(['/login']);
    });
  }

  async loadPoli() {
    const token = await this.authService.getToken();
    if (!token) {
      this.alert.presentAlert('Token Hilang', 'Silakan login ulang.');
      this.router.navigate(['/login']);
      return;
    }

    this.antrianService.getPoliTersedia().subscribe({
      next: (res) => {
        this.poliList = res.data;
      },
      error: (err) => {
        console.error('Gagal mengambil data poli:', err);
        this.alert.presentAlert('Error', 'Gagal mengambil data poli');
      },
    });
  }

  async onPoliChange() {
    this.selectedDate = '';
    this.selectedJadwal = null;
    this.tanggalTersedia = [];
    this.sesiList = [];
    this.jamTersedia = [];

    if (this.selectedPoliId !== null) {
      this.antrianService.getTanggalTersedia(this.selectedPoliId).subscribe({
        next: (res) => {
          this.tanggalTersedia = res.tanggal_tersedia;
        },
        error: () => {
          this.alert.presentAlert('Error', 'Gagal mengambil tanggal tersedia');
        },
      });
    }
  }

  async onDateChange(event: any) {
    const rawDateTime = event.detail?.value;
    const selectedOnlyDate = new Date(rawDateTime).toISOString().slice(0, 10);

    const isValidDate = this.tanggalTersedia.some(
      (t) => t.tanggal === selectedOnlyDate
    );

    if (!isValidDate) {
      this.alert.presentAlert('Validasi', 'Tanggal yang dipilih tidak tersedia!');
      this.selectedDate = '';
      this.sesiList = [];
      return;
    }

    this.selectedDate = selectedOnlyDate;
    this.selectedJadwal = null;
    this.jamTersedia = [];

    if (this.selectedPoliId !== null) {
      this.antrianService.getSesiTersedia(this.selectedPoliId, this.selectedDate).subscribe({
        next: (res) => {
          this.sesiList = res.sesi;
        },
        error: () => {
          this.alert.presentAlert('Error', 'Gagal mengambil sesi tersedia');
        },
      });
    }
  }

  // 🔁 Saat pasien pilih sesi, hitung jam layanan tersedia dalam sesi
  onSesiChange() {
  this.jamTersedia = [];

  if (!this.selectedJadwal || !this.selectedJadwal.slot_waktu) return;

  this.jamTersedia = this.selectedJadwal.slot_waktu;
  this.selectedJam = '';
}


  async daftarAntrian() {
    if (
      this.selectedPoliId === null ||
      !this.selectedDate ||
      !this.selectedJadwal ||
      !this.selectedJam
    ) {
      this.alert.presentAlert('Validasi', 'Harap pilih poli, tanggal, sesi dan jam layanan.');
      return;
    }

    const payload = {
      jadwal_poli_id: this.selectedJadwal.jadwal_poli_id,
      tanggal_antrian: this.selectedDate,
      estimasi_panggilan: this.selectedJam,
    };

    try {
      const observable = await this.antrianService.daftarAntrian(
        payload.jadwal_poli_id,
        payload.tanggal_antrian,
        payload.estimasi_panggilan
      );

      observable.subscribe({
        next: () => {
          this.alert.presentAlert('Sukses', 'Berhasil mendaftar antrian');
          this.router.navigate(['/status-antrian']);
        },
        error: (err) => {
          const msg = err?.error?.message || 'Gagal mendaftar antrian.';
          this.alert.presentAlert('Gagal', msg);
        },
      });
    } catch (error) {
      console.error('Error saat mendaftar:', error);
    }
  }

  isDateEnabled = (dateIsoString: string): boolean => {
    const tanggal = dateIsoString.slice(0, 10);
    return this.tanggalTersedia.some((t) => t.tanggal === tanggal);
  };
}
