import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisorConcentradosComponent } from './visor-concentrados/visor-concentrados.component';
import { ConcentradosRoutingModule } from './concentrados-routing.module';

import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations:
  [VisorConcentradosComponent],
  imports: [
    CommonModule,
    ConcentradosRoutingModule,
    
    FlexLayoutModule,
    SharedModule


  ],providers:[
    
  ]

})
export class ConcentradosModule { }
