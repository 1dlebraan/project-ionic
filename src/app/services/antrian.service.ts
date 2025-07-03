import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError, interval, Subject, Subscription } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AntrianService {
  private API_URL = environment.apiUrl;
  private pollingSub!: Subscription;
  private notifSubject = new Subject<void>();
  notif$ = this.notifSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 🔹 Start polling status antrian setiap 5 detik
  startPollingStatus() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe(); // hentikan polling lama kalau ada
    }

    this.pollingSub = interval(15000)
      .pipe(
        switchMap(() => this.getStatusAntrian())
      )
      .subscribe({
        next: (res) => {
          if (res.status && res.antrian?.status_antrian === 'dipanggil') {
            this.notifSubject.next();
          }
        },
        error: (err) => {
          console.error('[AntrianService] Polling error:', err);
        }
      });
  }

  // 🔹 Stop polling
  stopPollingStatus() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  // 🔹 API API lainnya tetap sama
  getPoliTersedia(): Observable<any> {
    return this.http.get(`${this.API_URL}/api/poli-tersedia`).pipe(
      tap((res) => console.log('[AntrianService] Poli tersedia:', res)),
      catchError((err) => {
        console.error('Gagal mengambil daftar poli:', err);
        return throwError(() => err);
      })
    );
  }

  getTanggalTersedia(poliId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/api/tanggal-tersedia/${poliId}`).pipe(
      tap((res) => console.log('[AntrianService] Tanggal tersedia:', res)),
      catchError((err) => {
        console.error('Gagal mengambil tanggal tersedia:', err);
        return throwError(() => err);
      })
    );
  }

  getSesiTersedia(poli_id: number, tanggal: string): Observable<any> {
    const body = { poli_id, tanggal };
    return this.http.post(`${this.API_URL}/api/sesi-tersedia`, body).pipe(
      tap((res) => console.log('[AntrianService] Sesi tersedia:', res)),
      catchError((err) => {
        console.error('Gagal mengambil sesi:', err);
        return throwError(() => err);
      })
    );
  }

  daftarAntrian(jadwal_poli_id: number, tanggal_antrian: string, estimasi_panggilan: string): Observable<any> {
    const body = { jadwal_poli_id, tanggal_antrian, estimasi_panggilan };
    return this.http.post(`${this.API_URL}/api/antrian/daftar`, body).pipe(
      tap((res) => console.log('[AntrianService] Berhasil daftar antrian:', res)),
      catchError((err) => {
        console.error('Gagal daftar antrian:', err);
        return throwError(() => err);
      })
    );
  }

  getStatusAntrian(): Observable<any> {
    return this.http.get(`${this.API_URL}/api/antrian/status`).pipe(
      tap((res) => console.log('[AntrianService] Status antrian:', res)),
      catchError((err) => {
        console.error('Gagal mengambil status antrian:', err);
        return throwError(() => err);
      })
    );
  }

  getHistoryAntrian(): Observable<any> {
  return this.http.get(`${this.API_URL}/api/antrian/history`).pipe(
    tap(res => console.log('[AntrianService] History antrian:', res)),
    catchError(err => {
      console.error('Gagal mengambil history antrian:', err);
      return throwError(() => err);
    })
  );
}

}
