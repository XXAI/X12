import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';

import { CallCenterRoutingModule } from './call-center-routing.module';
import { ListaLlamadasComponent } from './lista-llamadas/lista-llamadas.component';
import { LlamadaComponent } from './llamada/llamada.component';
//import { FormularioDialogoComponent } from './formulario-dialogo/formulario-dialogo.component';


@NgModule({
  declarations: [ListaLlamadasComponent, LlamadaComponent], //, FormularioDialogoComponent
  imports: [
    CommonModule,
    CallCenterRoutingModule,
    SharedModule,
  ],
  entryComponents:[
    //FormularioDialogoComponent
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class CallCenterModule { }
