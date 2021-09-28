import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BadorderPageRoutingModule } from './badorder-routing.module';

import { BadorderPage } from './badorder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BadorderPageRoutingModule
  ],
  declarations: [BadorderPage]
})
export class BadorderPageModule {}
