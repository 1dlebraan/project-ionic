import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // ✅ TAMBAH: Import ini untuk fungsionalitas HTTP dan Interceptor
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor } from './interceptors/jwt.interceptor'; // ✅ TAMBAH: Import JwtInterceptor Anda



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    
  ],

  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS, // ✅ TAMBAH: Mendaftarkan interceptor HTTP Anda
      useClass: JwtInterceptor, // Menggunakan kelas JwtInterceptor yang telah dibuat
      multi: true, // Penting: Mengizinkan beberapa interceptor untuk berjalan
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
