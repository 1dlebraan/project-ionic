import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PenggunaPageRoutingModule } from './pengguna-routing.module';

import { PenggunaPage } from './pengguna.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PenggunaPageRoutingModule
  ],
  declarations: [PenggunaPage]
})
export class PenggunaPageModule {}
