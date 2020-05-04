import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { ListaActividadesComponent } from './lista-actividades/lista-actividades.component';

const routes: Routes = [
  { path: 'avances-actividades', component: ListaActividadesComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvancesActividadesRoutingModule { }
