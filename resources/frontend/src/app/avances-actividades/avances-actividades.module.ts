import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { AvancesActividadesRoutingModule } from './avances-actividades-routing.module';
import { ListaActividadesComponent } from './lista-actividades/lista-actividades.component';
import { ListaAvancesDialogoComponent } from './lista-avances-dialogo/lista-avances-dialogo.component';


@NgModule({
  declarations: [ListaActividadesComponent, ListaAvancesDialogoComponent],
  imports: [
    CommonModule,
    SharedModule,
    AvancesActividadesRoutingModule
  ],
  entryComponents:[
    ListaAvancesDialogoComponent
  ]
})
export class AvancesActividadesModule { }
