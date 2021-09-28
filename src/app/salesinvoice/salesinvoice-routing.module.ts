import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesinvoicePage } from './salesinvoice.page';

const routes: Routes = [
  {
    path: '',
    component: SalesinvoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesinvoicePageRoutingModule {}
