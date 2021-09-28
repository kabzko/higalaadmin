import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesinvoicePageRoutingModule } from './salesinvoice-routing.module';

import { SalesinvoicePage } from './salesinvoice.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesinvoicePageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [SalesinvoicePage]
})
export class SalesinvoicePageModule {}
