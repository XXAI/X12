import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';

import { ContingenciasRoutingModule } from './contingencias-routing.module';
import { ListaContingenciasComponent } from './lista-contingencias/lista-contingencias.component';
import { CasosComponent } from './casos/casos.component';
import { ExpedienteCasoComponent } from './expediente-caso/expediente-caso.component';


@NgModule({
  declarations: [ListaContingenciasComponent, CasosComponent, ExpedienteCasoComponent],
  imports: [
    CommonModule,
    ContingenciasRoutingModule,
    SharedModule
  ],
  entryComponents:[
    ExpedienteCasoComponent
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class ContingenciasModule { }
