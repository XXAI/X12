import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvanceDiarioDosisRoutingModule } from './avance-diario-dosis-routing.module';
import { ListaComponent } from './lista/lista.component';


@NgModule({
  declarations: [ListaComponent],
  imports: [
    CommonModule,
    AvanceDiarioDosisRoutingModule
  ]
})
export class AvanceDiarioDosisModule { }
