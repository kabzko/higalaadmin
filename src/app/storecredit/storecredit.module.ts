import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorecreditPageRoutingModule } from './storecredit-routing.module';

import { StorecreditPage } from './storecredit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorecreditPageRoutingModule
  ],
  declarations: [StorecreditPage]
})
export class StorecreditPageModule {}
