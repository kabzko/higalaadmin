import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockinventoryPageRoutingModule } from './stockinventory-routing.module';

import { StockinventoryPage } from './stockinventory.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockinventoryPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [StockinventoryPage]
})
export class StockinventoryPageModule {}
