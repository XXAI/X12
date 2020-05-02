import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisorConcentradosComponent } from './visor-concentrados/visor-concentrados.component';
const routes: Routes = [
  { path: 'casos-concentrados', component: VisorConcentradosComponent, data: { hideHeader: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConcentradosRoutingModule { }