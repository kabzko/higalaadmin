import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddstockdeliveryPage } from './addstockdelivery.page';

const routes: Routes = [
  {
    path: '',
    component: AddstockdeliveryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddstockdeliveryPageRoutingModule {}
