import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PilihPoliPageRoutingModule } from './pilih-poli-routing.module';
import { PilihPoliPage } from './pilih-poli.page';


@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PilihPoliPageRoutingModule],
  declarations: [PilihPoliPage],
})
export class PilihPoliPageModule {}
