import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevToolsRoutingModule } from './dev-tools-routing.module';
import { ReporterModule } from './reporter/reporter.module';
import { VariablesGlobalesModule } from './variables-globales/variables-globales.module';
import { DevToolsComponent } from './dev-tools.component';

@NgModule({
  declarations: [DevToolsComponent],
  imports: [
    CommonModule,
    DevToolsRoutingModule
  ],
  exports:[
    ReporterModule,
    VariablesGlobalesModule
  ]
})
export class DevToolsModule { }
