import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoLlenadoComponent } from './listado-llenado/listado-llenado.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'listado-llenado-formulario', component: ListadoLlenadoComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormulariosRoutingModule { }
