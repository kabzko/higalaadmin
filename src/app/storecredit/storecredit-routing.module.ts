import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StorecreditPage } from './storecredit.page';

const routes: Routes = [
  {
    path: '',
    component: StorecreditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorecreditPageRoutingModule {}
