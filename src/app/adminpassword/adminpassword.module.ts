import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminpasswordPageRoutingModule } from './adminpassword-routing.module';

import { AdminpasswordPage } from './adminpassword.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminpasswordPageRoutingModule
  ],
  declarations: [AdminpasswordPage]
})
export class AdminpasswordPageModule {}
