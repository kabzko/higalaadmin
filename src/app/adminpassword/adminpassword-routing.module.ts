import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminpasswordPage } from './adminpassword.page';

const routes: Routes = [
  {
    path: '',
    component: AdminpasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminpasswordPageRoutingModule {}
