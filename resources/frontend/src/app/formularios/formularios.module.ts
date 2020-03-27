import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';

import { FormulariosRoutingModule } from './formularios-routing.module';
import { ListadoLlenadoComponent } from './listado-llenado/listado-llenado.component';
import { DetallesLlenadoFormularioComponent } from './detalles-llenado-formulario/detalles-llenado-formulario.component';


@NgModule({
  declarations: [ListadoLlenadoComponent, DetallesLlenadoFormularioComponent],
  imports: [
    CommonModule,
    FormulariosRoutingModule,
    SharedModule
  ],
  entryComponents:[
    DetallesLlenadoFormularioComponent
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class FormulariosModule { }
