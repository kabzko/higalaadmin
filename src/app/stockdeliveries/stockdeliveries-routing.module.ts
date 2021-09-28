import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockdeliveriesPage } from './stockdeliveries.page';

const routes: Routes = [
  {
    path: '',
    component: StockdeliveriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockdeliveriesPageRoutingModule {}
