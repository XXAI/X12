import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { VariablesGlobalesRoutingModule } from './variables-globales-routing.module';
import { ListaVariablesComponent } from './lista-variables/lista-variables.component';
import { FormVariableDialogoComponent } from './form-variable-dialogo/form-variable-dialogo.component';


@NgModule({
  declarations: [ListaVariablesComponent, FormVariableDialogoComponent],
  imports: [
    CommonModule,
    SharedModule,
    VariablesGlobalesRoutingModule
  ],
  entryComponents:[
    FormVariableDialogoComponent
  ]
})
export class VariablesGlobalesModule { }
