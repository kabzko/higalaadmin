import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesanalysisPageRoutingModule } from './salesanalysis-routing.module';

import { SalesanalysisPage } from './salesanalysis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesanalysisPageRoutingModule
  ],
  declarations: [SalesanalysisPage]
})
export class SalesanalysisPageModule {}
