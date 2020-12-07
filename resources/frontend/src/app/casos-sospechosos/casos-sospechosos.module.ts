import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl, MAT_DATE_FORMATS, MAT_DATE_LOCALE  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';

import { CasosSospechososRoutingModule } from './casos-sospechosos-routing.module';
import { IndexComponent } from './index/index.component';
import { FormComponent } from './form/form.component';


@NgModule({
  declarations: [IndexComponent, FormComponent],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ],
  imports: [
    CommonModule,
    CasosSospechososRoutingModule,
    SharedModule
  ]
})
export class CasosSospechososModule { }
