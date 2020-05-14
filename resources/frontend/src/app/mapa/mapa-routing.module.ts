import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisorComponent } from './visor/visor.component';

const routes: Routes = [
  { path: 'mapa-visor', component: VisorComponent, data: { hideHeader: true } },
  { path: 'mapa-casos-visor', component: VisorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapaRoutingModule { }
