import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { ListaGruposComponent } from './lista-grupos/lista-grupos.component';

const routes: Routes = [
  { path: 'grupos-estrategicos', component: ListaGruposComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GruposEstrategicosRoutingModule { }
