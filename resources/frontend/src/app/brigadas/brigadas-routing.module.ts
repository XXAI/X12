import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { ListadoRondasComponent } from './listado-rondas/listado-rondas.component';
import { RondaComponent } from './ronda/ronda.component';

const routes: Routes = [
  { path: 'listado-rondas', component: ListadoRondasComponent, canActivate: [AuthGuard] },
  { path: 'listado-rondas/ronda/:id', component: RondaComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrigadasRoutingModule { }
