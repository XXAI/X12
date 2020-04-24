import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisorGraficasComponent } from './visor-graficas/visor-graficas.component';
import { GraficasRoutingModule } from './graficas-routing.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations:
  [VisorGraficasComponent, VisorGraficasComponent],
  imports: [
    CommonModule,
    GraficasRoutingModule,
    GoogleChartsModule.forRoot(),
    FlexLayoutModule,
    SharedModule


  ]

})
export class GraficasModule { }
