import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { EstrategiasRoutingModule } from './estrategias-routing.module';
import { ListaComponent } from './lista/lista.component';
import { EstrategiaComponent } from './estrategia/estrategia.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { ActividadDialogComponent } from './actividad-dialog/actividad-dialog.component';
import { ActividadMetaDialogComponent } from './actividad-meta-dialog/actividad-meta-dialog.component';
import { ActividadesMetasComponent } from './actividades-metas/actividades-metas.component';


@NgModule({
  declarations: [ListaComponent, EstrategiaComponent, ActividadesComponent, ActividadDialogComponent, ActividadMetaDialogComponent, ActividadesMetasComponent],
  imports: [
    CommonModule,
    SharedModule,
    EstrategiasRoutingModule
  ],
  entryComponents: [
    ActividadDialogComponent,
    ActividadMetaDialogComponent
  ]
})
export class EstrategiasModule { }
