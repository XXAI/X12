import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisorConcentradosComponent } from './visor-concentrados/visor-concentrados.component';
import { AuthGuard } from '../auth/auth.guard';
const routes: Routes = [
  { path: 'casos-concentrados', component: VisorConcentradosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConcentradosRoutingModule { }