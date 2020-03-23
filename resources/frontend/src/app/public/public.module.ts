import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE  } from '@angular/material';

import { PublicRoutingModule } from './public-routing.module';
import { FormularioComponent } from './formulario/formulario.component';


@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    PublicRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'}
  ]
})
export class PublicModule { }
