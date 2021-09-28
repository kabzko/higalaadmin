import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreadminPage } from './storeadmin.page';

const routes: Routes = [
  {
    path: '',
    component: StoreadminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreadminPageRoutingModule {}
