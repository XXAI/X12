import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { AvanceDiarioDosisRoutingModule } from './avance-diario-dosis-routing.module';
import { ListaComponent } from './lista/lista.component';
import { DialogoConfigMetasComponent } from './dialogo-config-metas/dialogo-config-metas.component';
import { DialogoAvanceDiaComponent } from './dialogo-avance-dia/dialogo-avance-dia.component';


@NgModule({
  declarations: [ListaComponent, DialogoConfigMetasComponent, DialogoAvanceDiaComponent],
  imports: [
    CommonModule,
    SharedModule,
    AvanceDiarioDosisRoutingModule,
  ],
  entryComponents:[
    DialogoConfigMetasComponent,
    DialogoAvanceDiaComponent,
  ],
  providers:[
    DatePipe
  ]
})
export class AvanceDiarioDosisModule { }
