import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioComponent } from './formulario/formulario.component';
import { EstadisticasCovidRoutingModule } from './estadisticas-covid-routing.module';
import { MatDatepickerModule, MatPaginatorIntl, MAT_DATE_LOCALE } from '@angular/material';
import { SharedModule } from '@app/shared/shared.module';
import { getEspPaginatorIntl } from '@app/esp-paginator-intl';



@NgModule({
  declarations: [ FormularioComponent,

  ],
  imports: [
    CommonModule,
    EstadisticasCovidRoutingModule,
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
export class EstadisticasCovidModule { }

