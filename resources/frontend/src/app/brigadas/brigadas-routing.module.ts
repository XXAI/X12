import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { ListadoRondasComponent } from './listado-rondas/listado-rondas.component';

const routes: Routes = [
  { path: 'listado-rondas', component: ListadoRondasComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrigadasRoutingModule { }
