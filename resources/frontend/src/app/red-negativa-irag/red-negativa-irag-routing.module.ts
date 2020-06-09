import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { RegistroDiarioComponent } from './registro-diario/registro-diario.component';

const routes: Routes = [
  { path: 'red-negativa-registro-diario', component: RegistroDiarioComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedNegativaIragRoutingModule { }
