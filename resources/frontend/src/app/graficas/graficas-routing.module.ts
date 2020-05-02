import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisorGraficasComponent } from './visor-graficas/visor-graficas.component';

const routes: Routes = [
  { path: 'casos-graficas', component: VisorGraficasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraficasRoutingModule { }
