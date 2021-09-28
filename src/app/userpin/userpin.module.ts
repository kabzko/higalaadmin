import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserpinPageRoutingModule } from './userpin-routing.module';

import { UserpinPage } from './userpin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserpinPageRoutingModule
  ],
  declarations: [UserpinPage]
})
export class UserpinPageModule {}
