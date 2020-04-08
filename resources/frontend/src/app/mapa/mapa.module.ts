import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapaRoutingModule } from './mapa-routing.module';
import { VisorComponent } from './visor/visor.component';
import { AgmCoreModule } from '@agm/core';



@NgModule({
  declarations: [VisorComponent],
  imports: [
    CommonModule,
    MapaRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAxA1oj37u__DPFiOqbTaYBGCyN04uDdIc'
    })
  ]
})
export class MapaModule { }
