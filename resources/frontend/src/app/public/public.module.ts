import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE  } from '@angular/material';

import { PublicRoutingModule } from './public-routing.module';
import { FormularioComponent } from './formulario/formulario.component';
import { ListaContingenciasComponent } from './lista-contingencias/lista-contingencias.component';
import { MapaComponent } from './mapa/mapa.component';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [FormularioComponent, ListaContingenciasComponent, MapaComponent],
  imports: [
    CommonModule,
    PublicRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAxA1oj37u__DPFiOqbTaYBGCyN04uDdIc'
    })
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'}
  ]
})
export class PublicModule { }
