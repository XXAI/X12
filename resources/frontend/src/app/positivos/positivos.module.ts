import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';

import { PositivosRoutingModule } from './positivos-routing.module';
import { ListaComponent } from './lista/lista.component';
import { FormularioComponent } from './formulario/formulario.component';
import { PersonaDialogComponent } from './persona-dialog/persona-dialog.component';
import { SalidaDialogComponent } from './salida-dialog/salida-dialog.component';
import { ActualizacionDialogComponent } from './actualizacion-dialog/actualizacion-dialog.component';


@NgModule({
  declarations: [ListaComponent, FormularioComponent, PersonaDialogComponent, SalidaDialogComponent, ActualizacionDialogComponent],
  imports: [
    CommonModule,
    PositivosRoutingModule,
    SharedModule
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ],
  entryComponents:[
    PersonaDialogComponent,
    SalidaDialogComponent,
    ActualizacionDialogComponent
  ],
})
export class PositivosModule { }
