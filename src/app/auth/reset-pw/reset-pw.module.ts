import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPwPageRoutingModule } from './reset-pw-routing.module';

import { ResetPwPage } from './reset-pw.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPwPageRoutingModule
  ],
  declarations: [ResetPwPage]
})
export class ResetPwPageModule {}
