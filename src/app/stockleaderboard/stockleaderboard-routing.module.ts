import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockleaderboardPage } from './stockleaderboard.page';

const routes: Routes = [
  {
    path: '',
    component: StockleaderboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockleaderboardPageRoutingModule {}
