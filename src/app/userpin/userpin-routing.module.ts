import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserpinPage } from './userpin.page';

const routes: Routes = [
  {
    path: '',
    component: UserpinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserpinPageRoutingModule {}
