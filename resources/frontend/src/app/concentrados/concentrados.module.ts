
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConcentradosRoutingModule } from './concentrados-routing.module';
import { VisorConcentradosModule } from './visor-concentrados/visor-concentrados.module';
import { VigilanciaClinicaModule } from './vigilancia-clinica/vigilancia-clinica.module';
import { ConcentradosComponent } from './concentrados.component';

@NgModule({
  declarations: [ConcentradosComponent],
  imports: [
    CommonModule,
    ConcentradosRoutingModule
  ],
  exports: [
    VisorConcentradosModule,
    VigilanciaClinicaModule
  ]
})
export class ConcentradosModule { }

