import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';

import { BrigadasRoutingModule } from './brigadas-routing.module';
import { ListadoRondasComponent } from './listado-rondas/listado-rondas.component';


@NgModule({
  declarations: [ListadoRondasComponent],
  imports: [
    CommonModule,
    BrigadasRoutingModule,
    SharedModule
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class BrigadasModule { }
