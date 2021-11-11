import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { AvanceDiarioDosisRoutingModule } from './avance-diario-dosis-routing.module';
import { ListaComponent } from './lista/lista.component';
import { DialogoConfigMetasComponent } from './dialogo-config-metas/dialogo-config-metas.component';


@NgModule({
  declarations: [ListaComponent, DialogoConfigMetasComponent],
  imports: [
    CommonModule,
    SharedModule,
    AvanceDiarioDosisRoutingModule
  ],
  entryComponents:[
    DialogoConfigMetasComponent
  ]
})
export class AvanceDiarioDosisModule { }
