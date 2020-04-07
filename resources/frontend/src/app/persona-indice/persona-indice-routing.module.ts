import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { ListaIndicesComponent } from './lista-indices/lista-indices.component';
import { IndiceContactoComponent } from './indice-contacto/indice-contacto.component';

const routes: Routes = [
  { path: 'listado-indices', component: ListaIndicesComponent, canActivate: [AuthGuard] },
  { path: 'listado-contacto/:id', component: IndiceContactoComponent, canActivate: [AuthGuard] }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonaIndiceRoutingModule { }
