import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatusAntrianPage } from './status-antrian.page';

const routes: Routes = [
  {
    path: '',
    component: StatusAntrianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusAntrianPageRoutingModule {}
