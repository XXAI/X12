import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ArchivosGruposRoutingModule } from './archivos-grupos-routing.module';
import { ListaComponent } from './lista/lista.component';
import { ArchivosGruposDialogComponent } from './archivos-grupos-dialog/archivos-grupos-dialog.component';



@NgModule({
  declarations: [ListaComponent, ArchivosGruposDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    ArchivosGruposRoutingModule
  ],
  entryComponents: [
    ArchivosGruposDialogComponent
  ]
})
export class ArchivosGruposModule { }
