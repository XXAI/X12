import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapaRoutingModule } from './mapa-routing.module';
import { VisorComponent } from './visor/visor.component';
import { AgmCoreModule } from '@agm/core';
import { MatTableModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [VisorComponent],
  imports: [
    CommonModule,
    MapaRoutingModule,
    MatTableModule,
    FlexLayoutModule,
    MatCardModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAxA1oj37u__DPFiOqbTaYBGCyN04uDdIc'
    })
  ]
})
export class MapaModule { }
