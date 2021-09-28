import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddlistexpensesPageRoutingModule } from './addlistexpenses-routing.module';

import { AddlistexpensesPage } from './addlistexpenses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddlistexpensesPageRoutingModule
  ],
  declarations: [AddlistexpensesPage]
})
export class AddlistexpensesPageModule {}
