import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddstockdeliveryPageRoutingModule } from './addstockdelivery-routing.module';

import { AddstockdeliveryPage } from './addstockdelivery.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddstockdeliveryPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [AddstockdeliveryPage]
})
export class AddstockdeliveryPageModule {}
