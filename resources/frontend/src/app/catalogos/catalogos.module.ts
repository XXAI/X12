import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogosRoutingModule } from './catalogos-routing.module';
//import { PacientesModule } from './pacientes/pacientes.module';

import { SharedModule } from '../shared/shared.module';
import { ResponsablesModule } from './responsables/responsables.module';

//DiagnosticosComponent


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    ResponsablesModule,
    CatalogosRoutingModule
  ],
  exports: [
    //PacientesModule,
  ]
})
export class CatalogosModule { }
