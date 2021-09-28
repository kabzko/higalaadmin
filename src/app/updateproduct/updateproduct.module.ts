import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateproductPageRoutingModule } from './updateproduct-routing.module';

import { UpdateproductPage } from './updateproduct.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateproductPageRoutingModule
  ],
  declarations: [UpdateproductPage]
})
export class UpdateproductPageModule {}
