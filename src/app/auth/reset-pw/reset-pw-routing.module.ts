import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPwPage } from './reset-pw.page';

const routes: Routes = [
  {
    path: '',
    component: ResetPwPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPwPageRoutingModule {}
