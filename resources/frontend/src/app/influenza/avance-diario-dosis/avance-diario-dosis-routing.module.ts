import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

import { ListaComponent } from './lista/lista.component';

const routes: Routes = [
  { path: 'influenza-avance-diario-dosis', component: ListaComponent, canActivate: [AuthGuard] },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvanceDiarioDosisRoutingModule { }
