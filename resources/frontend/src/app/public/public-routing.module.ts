import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormularioComponent } from './formulario/formulario.component';
import { AuthGuard } from '../auth/auth.guard';
import { GuessGuard } from '../auth/guess.guard';


const routes: Routes = [
  { path: 'llenar-formulario', component: FormularioComponent, canActivate: [GuessGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
