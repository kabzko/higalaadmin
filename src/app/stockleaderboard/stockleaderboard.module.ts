import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockleaderboardPageRoutingModule } from './stockleaderboard-routing.module';

import { StockleaderboardPage } from './stockleaderboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockleaderboardPageRoutingModule
  ],
  declarations: [StockleaderboardPage]
})
export class StockleaderboardPageModule {}
