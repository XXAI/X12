import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogosRoutingModule } from './catalogos-routing.module';
import { CatalogosComponent } from './catalogos.component';
//import { PacientesModule } from './pacientes/pacientes.module';

import { SharedModule } from '../shared/shared.module';
import { ResponsablesModule } from './responsables/responsables.module';

//DiagnosticosComponent


@NgModule({
  declarations: [CatalogosComponent],
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
