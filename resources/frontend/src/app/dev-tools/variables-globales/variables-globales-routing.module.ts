import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

import { ListaVariablesComponent } from './lista-variables/lista-variables.component';

const routes: Routes = [
  { path:'dev-tools/variables-globales', component: ListaVariablesComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariablesGlobalesRoutingModule { }
