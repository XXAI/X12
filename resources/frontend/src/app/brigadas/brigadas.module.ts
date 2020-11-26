import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';

import { BrigadasRoutingModule } from './brigadas-routing.module';
import { ListadoRondasComponent } from './listado-rondas/listado-rondas.component';
import { RondaComponent } from './ronda/ronda.component';
import { DialogoNuevaRondaComponent } from './dialogo-nueva-ronda/dialogo-nueva-ronda.component';
import { DialogoRegistroComponent } from './dialogo-registro/dialogo-registro.component';
import { DialogoFinalizarRondaComponent } from './dialogo-finalizar-ronda/dialogo-finalizar-ronda.component';
import { DialogoVerRegistroComponent } from './dialogo-ver-registro/dialogo-ver-registro.component';
import { DialogoConfigBrigadasComponent } from './dialogo-config-brigadas/dialogo-config-brigadas.component';


@NgModule({
  declarations: [ListadoRondasComponent, RondaComponent, DialogoNuevaRondaComponent, DialogoRegistroComponent, DialogoFinalizarRondaComponent, DialogoVerRegistroComponent, DialogoConfigBrigadasComponent],
  imports: [
    CommonModule,
    BrigadasRoutingModule,
    SharedModule
  ],
  entryComponents:[
    DialogoNuevaRondaComponent,
    DialogoConfigBrigadasComponent,
    DialogoRegistroComponent,
    DialogoFinalizarRondaComponent,
    DialogoVerRegistroComponent
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class BrigadasModule { }
