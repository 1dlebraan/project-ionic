import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, from } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.apiUrl;
  private JWT_KEY = 'jwt_token';
  private USER_DATA_KEY = 'user_data';

  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser: Observable<any> = this.currentUserSubject.asObservable();
  private authToken: string | null = null;

  constructor(private http: HttpClient) {
    this.loadTokenAndUser();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  async getToken(): Promise<string | null> {
  if (!this.authToken) {
    this.authToken = localStorage.getItem(this.JWT_KEY);
  }
  return this.authToken;
}




  private saveAuthData(token: string, user: any) {
    this.authToken = token;
    localStorage.setItem(this.JWT_KEY, token);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private clearLocalData() {
    this.authToken = null;
    localStorage.removeItem(this.JWT_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    this.currentUserSubject.next(null);
  }

  private loadTokenAndUser() {
    this.authToken = localStorage.getItem(this.JWT_KEY);
    const userString = localStorage.getItem(this.USER_DATA_KEY);
    if (userString) {
      const user = JSON.parse(userString);
      this.currentUserSubject.next(user);
    }
  }

  register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    nik: string,
    tempat_lahir: string,
    tanggal_lahir: string,
    jenis_kelamin: 'Laki - Laki' | 'Perempuan',
    no_hp: string,
    alamat?: string
  ): Observable<any> {
    const data = {
      name,
      email,
      password,
      password_confirmation,
      nik,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      no_hp,
      alamat,
    };

    return this.http.post<any>(`${this.API_URL}/api/register`, data).pipe(
      tap((res) => {
        if (res.token && res.user) {
          this.saveAuthData(res.token, res.user);
        }
      }),
      catchError((error) => {
        console.error('Registration failed:', error);
        return throwError(() => error);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.http.post<any>(`${this.API_URL}/api/login`, data).pipe(
      tap((res) => {
        if (res.token && res.user) {
          this.saveAuthData(res.token, res.user);
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/api/logout`, {}).pipe(
      tap(() => {
        this.clearLocalData();
      }),
      catchError((error) => {
        console.error('Logout failed:', error);
        this.clearLocalData();
        return throwError(() => error);
      })
    );
  }

  getProfile(): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<any>(`${this.API_URL}/api/profile`, { headers });
      }),
      tap((res) => {
        if (res.user) {
          localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      }),
      catchError((error) => {
        console.error('Failed to fetch profile:', error);
        return throwError(() => error);
      })
    );
  }

  updateProfile(updatedData: any): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post<any>(`${this.API_URL}/api/update-profile`, updatedData, { headers });
      }),
      tap((res) => {
        if (res.user) {
          localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      }),
      catchError((error) => {
        console.error('Failed to update profile:', error);
        return throwError(() => error);
      })
    );
  }

  async getAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}
