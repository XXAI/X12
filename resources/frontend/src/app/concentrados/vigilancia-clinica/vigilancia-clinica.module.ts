import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VigilanciaClinicaRoutingModule } from './vigilancia-clinica-routing.module';
import { CamasComponent } from './camas/camas.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CamasComponent],
  imports: [
    CommonModule,
    SharedModule,
    VigilanciaClinicaRoutingModule
  ]
})
export class VigilanciaClinicaModule { }
