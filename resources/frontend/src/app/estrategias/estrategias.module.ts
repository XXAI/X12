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
import { ActividadMetaGrupoDialogComponent } from './actividad-meta-grupo-dialog/actividad-meta-grupo-dialog.component';


@NgModule({
  declarations: [ListaComponent, EstrategiaComponent, ActividadesComponent, ActividadDialogComponent, ActividadMetaDialogComponent, ActividadesMetasComponent, ActividadMetaGrupoDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    EstrategiasRoutingModule
  ],
  entryComponents: [
    ActividadDialogComponent,
    ActividadMetaDialogComponent,
    ActividadMetaGrupoDialogComponent
  ]
})
export class EstrategiasModule { }
