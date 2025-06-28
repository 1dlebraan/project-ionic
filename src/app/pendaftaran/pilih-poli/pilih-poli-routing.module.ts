import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PilihPoliPage } from './pilih-poli.page';

const routes: Routes = [
  {
    path: '',
    component: PilihPoliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PilihPoliPageRoutingModule {}
