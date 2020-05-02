import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { EstrategiasRoutingModule } from './estrategias-routing.module';
import { ListaComponent } from './lista/lista.component';
import { EstrategiaComponent } from './estrategia/estrategia.component';


@NgModule({
  declarations: [ListaComponent, EstrategiaComponent],
  imports: [
    CommonModule,
    SharedModule,
    EstrategiasRoutingModule
  ]
})
export class EstrategiasModule { }
