import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PenggunaPage } from './pengguna.page';

const routes: Routes = [
  {
    path: '',
    component: PenggunaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PenggunaPageRoutingModule {}
