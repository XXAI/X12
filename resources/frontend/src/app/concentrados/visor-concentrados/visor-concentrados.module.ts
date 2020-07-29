import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisorRoutingModule } from './visor-concentrados-routing.module';
import { VisorConcentradosComponent } from './visor/visor-concentrados.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [VisorConcentradosComponent],
  imports: [
    CommonModule,
    SharedModule,
    VisorRoutingModule
  ]
})
export class VisorConcentradosModule { }
