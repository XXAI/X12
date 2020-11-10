import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';

import { BrigadasRoutingModule } from './brigadas-routing.module';
import { ListadoRondasComponent } from './listado-rondas/listado-rondas.component';
import { RondaComponent } from './ronda/ronda.component';
import { DialogoNuevaRondaComponent } from './dialogo-nueva-ronda/dialogo-nueva-ronda.component';
import { DialogoBrigadistasComponent } from './dialogo-brigadistas/dialogo-brigadistas.component';
import { DialogoRegistroComponent } from './dialogo-registro/dialogo-registro.component';
import { DialogoFinalizarRondaComponent } from './dialogo-finalizar-ronda/dialogo-finalizar-ronda.component';


@NgModule({
  declarations: [ListadoRondasComponent, RondaComponent, DialogoNuevaRondaComponent, DialogoBrigadistasComponent, DialogoRegistroComponent, DialogoFinalizarRondaComponent],
  imports: [
    CommonModule,
    BrigadasRoutingModule,
    SharedModule
  ],
  entryComponents:[
    DialogoNuevaRondaComponent,
    DialogoBrigadistasComponent,
    DialogoRegistroComponent,
    DialogoFinalizarRondaComponent
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class BrigadasModule { }
