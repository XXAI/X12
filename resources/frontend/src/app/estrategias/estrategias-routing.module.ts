import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { ListaComponent } from './lista/lista.component';
import { EstrategiaComponent } from './estrategia/estrategia.component';

const routes: Routes = [
  { path: 'estrategias', component: ListaComponent, canActivate: [AuthGuard] },
  { path: 'estrategias/nueva', component: EstrategiaComponent, canActivate: [AuthGuard] },
  { path: 'estrategias/editar/id:', component: EstrategiaComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstrategiasRoutingModule { }
