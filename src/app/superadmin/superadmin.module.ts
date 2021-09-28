import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuperadminPageRoutingModule } from './superadmin-routing.module';

import { SuperadminPage } from './superadmin.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperadminPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [SuperadminPage]
})
export class SuperadminPageModule {}
