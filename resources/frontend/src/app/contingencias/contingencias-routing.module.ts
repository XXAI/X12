import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { ListaContingenciasComponent } from './lista-contingencias/lista-contingencias.component';
import { CasosComponent } from './casos/casos.component';

const routes: Routes = [
  { path: 'listado-contingencias', component: ListaContingenciasComponent, canActivate: [AuthGuard] },
  { path: 'listado-contingencias/listado-casos/:id', component: CasosComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContingenciasRoutingModule { }
