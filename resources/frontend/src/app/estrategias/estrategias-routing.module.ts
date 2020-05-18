import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { ListaComponent } from './lista/lista.component';
import { EstrategiaComponent } from './estrategia/estrategia.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { ActividadesMetasComponent } from './actividades-metas/actividades-metas.component';

const routes: Routes = [
  { path: 'estrategias', component: ListaComponent, canActivate: [AuthGuard] },
  { path: 'estrategias/nueva', component: EstrategiaComponent, canActivate: [AuthGuard] },
  { path: 'estrategias/editar/:id', component: EstrategiaComponent, canActivate: [AuthGuard] },
  { path: 'estrategias/editar/:id/actividad/:id2', component: ActividadesComponent, canActivate: [AuthGuard] },
  { path: 'estrategias/editar/:id/actividad/:id2/meta/:id3', component: ActividadesMetasComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstrategiasRoutingModule { }
