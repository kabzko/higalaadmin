import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BadorderPage } from './badorder.page';

const routes: Routes = [
  {
    path: '',
    component: BadorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BadorderPageRoutingModule {}
