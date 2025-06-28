import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPwInputPageRoutingModule } from './reset-pw-input-routing.module';

import { ResetPwInputPage } from './reset-pw-input.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPwInputPageRoutingModule
  ],
  declarations: [ResetPwInputPage]
})
export class ResetPwInputPageModule {}
