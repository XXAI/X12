import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl, MatDatepickerModule, MAT_DATE_LOCALE } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';

import { VigilanciaClinicaRoutingModule } from './vigilancia-clinica-routing.module';
import { ListaComponent } from './lista/lista.component';
import { FormularioComponent } from './formulario/formulario.component';
// import { PersonaDialogComponent } from './persona-dialog/persona-dialog.component';
// import { SalidaDialogComponent } from './salida-dialog/salida-dialog.component';
// import { ActualizacionDialogComponent } from './actualizacion-dialog/actualizacion-dialog.component';


@NgModule({
  declarations: [ListaComponent, FormularioComponent,
    // PersonaDialogComponent,
    // SalidaDialogComponent,
    // ActualizacionDialogComponent
  ],
  imports: [
    CommonModule,
    VigilanciaClinicaRoutingModule,
    SharedModule,
    MatDatepickerModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ],
  entryComponents: [
    // PersonaDialogComponent,
    // SalidaDialogComponent,
    // ActualizacionDialogComponent
  ],
})
export class VigilanciaClinicaModule { }
