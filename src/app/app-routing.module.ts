import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // pastikan path ini sesuai lokasi AuthGuard kamu

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pilih-poli',
    loadChildren: () => import('./pendaftaran/pilih-poli/pilih-poli.module').then(m => m.PilihPoliPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'status-antrian',
    loadChildren: () => import('./pendaftaran/status-antrian/status-antrian.module').then(m => m.StatusAntrianPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then(m => m.HistoryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pengguna',
    loadChildren: () => import('./pengguna/pengguna.module').then(m => m.PenggunaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'reset-pw',
    loadChildren: () => import('./auth/reset-pw/reset-pw.module').then(m => m.ResetPwPageModule)
  },
  {
    path: 'reset-pw-input',
    loadChildren: () => import('./auth/reset-pw-input/reset-pw-input.module').then(m => m.ResetPwInputPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
