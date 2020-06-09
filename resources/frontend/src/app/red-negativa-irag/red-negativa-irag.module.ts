import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { RedNegativaIragRoutingModule } from './red-negativa-irag-routing.module';
import { RegistroDiarioComponent } from './registro-diario/registro-diario.component';


@NgModule({
  declarations: [RegistroDiarioComponent],
  imports: [
    CommonModule,
    SharedModule,
    RedNegativaIragRoutingModule,
    ScrollDispatchModule
  ]
})
export class RedNegativaIragModule { }
