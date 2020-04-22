import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';

import { CallCenterRoutingModule } from './call-center-routing.module';
import { ListaLlamadasComponent } from './lista-llamadas/lista-llamadas.component';
import { LlamadaComponent } from './llamada/llamada.component';
import { VerDetallesLlamadaDialogoComponent } from './ver-detalles-llamada-dialogo/ver-detalles-llamada-dialogo.component';
import { BuscarFormularioDialogoComponent } from './buscar-formulario-dialogo/buscar-formulario-dialogo.component';


@NgModule({
  declarations: [ListaLlamadasComponent, LlamadaComponent, VerDetallesLlamadaDialogoComponent, BuscarFormularioDialogoComponent],
  imports: [
    CommonModule,
    CallCenterRoutingModule,
    SharedModule,
  ],
  entryComponents:[
    VerDetallesLlamadaDialogoComponent,
    BuscarFormularioDialogoComponent
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class CallCenterModule { }
