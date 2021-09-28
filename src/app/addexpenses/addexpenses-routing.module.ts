import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddexpensesPage } from './addexpenses.page';

const routes: Routes = [
  {
    path: '',
    component: AddexpensesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddexpensesPageRoutingModule {}
