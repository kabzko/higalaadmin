import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddexpensesPageRoutingModule } from './addexpenses-routing.module';

import { AddexpensesPage } from './addexpenses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddexpensesPageRoutingModule
  ],
  declarations: [AddexpensesPage]
})
export class AddexpensesPageModule {}
