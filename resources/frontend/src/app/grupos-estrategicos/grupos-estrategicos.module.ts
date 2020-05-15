import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { GruposEstrategicosRoutingModule } from './grupos-estrategicos-routing.module';
import { ListaGruposComponent } from './lista-grupos/lista-grupos.component';
import { FormGrupoDialogoComponent } from './form-grupo-dialogo/form-grupo-dialogo.component';
import { GrupoUsuariosDialogoComponent } from './grupo-usuarios-dialogo/grupo-usuarios-dialogo.component';


@NgModule({
  declarations: [ListaGruposComponent, FormGrupoDialogoComponent, GrupoUsuariosDialogoComponent],
  imports: [
    CommonModule,
    SharedModule,
    GruposEstrategicosRoutingModule
  ],
  entryComponents:[
    FormGrupoDialogoComponent,
    GrupoUsuariosDialogoComponent
  ]
})
export class GruposEstrategicosModule { }
