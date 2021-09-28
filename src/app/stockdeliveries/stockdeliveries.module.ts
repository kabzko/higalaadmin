import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockdeliveriesPageRoutingModule } from './stockdeliveries-routing.module';

import { StockdeliveriesPage } from './stockdeliveries.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockdeliveriesPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [StockdeliveriesPage]
})
export class StockdeliveriesPageModule {}
