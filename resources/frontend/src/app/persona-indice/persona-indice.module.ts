import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';

import { PersonaIndiceRoutingModule } from './persona-indice-routing.module';

import { ListaIndicesComponent } from './lista-indices/lista-indices.component';
import { IndiceContactoComponent } from './indice-contacto/indice-contacto.component';
import { AgregarContactoDialogComponent } from './agregar-contacto-dialog/agregar-contacto-dialog.component';
import { MapaComponent } from './mapa/mapa.component';
import { AgmCoreModule } from '@agm/core';
import { AgregarIndiceDialogComponent } from './agregar-indice-dialog/agregar-indice-dialog.component';
import { SalidaDialogComponent } from './salida-dialog/salida-dialog.component';
import { ActualizacionDialogComponent } from './actualizacion-dialog/actualizacion-dialog.component';
import { PersonaDialogComponent } from './persona-dialog/persona-dialog.component';



@NgModule({
  declarations: [ListaIndicesComponent, IndiceContactoComponent, PersonaDialogComponent, AgregarContactoDialogComponent, MapaComponent, AgregarIndiceDialogComponent, SalidaDialogComponent, ActualizacionDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    PersonaIndiceRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAxA1oj37u__DPFiOqbTaYBGCyN04uDdIc'
    })
  ],
  entryComponents:[
    AgregarContactoDialogComponent,
    MapaComponent,
    AgregarIndiceDialogComponent,
    SalidaDialogComponent,
    ActualizacionDialogComponent,
    PersonaDialogComponent
  ],
})
export class PersonaIndiceModule { }
