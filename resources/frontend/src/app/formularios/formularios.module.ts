import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';

import { FormulariosRoutingModule } from './formularios-routing.module';
import { ListadoLlenadoComponent } from './listado-llenado/listado-llenado.component';
import { DetallesLlenadoFormularioComponent } from './detalles-llenado-formulario/detalles-llenado-formulario.component';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [ListadoLlenadoComponent, DetallesLlenadoFormularioComponent],
  imports: [
    CommonModule,
    FormulariosRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAxA1oj37u__DPFiOqbTaYBGCyN04uDdIc'
    })
  ],
  entryComponents:[
    DetallesLlenadoFormularioComponent
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class FormulariosModule { }
