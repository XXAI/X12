import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormularioComponent } from './formulario/formulario.component';
import { MapaComponent } from './mapa/mapa.component';
import { ListaContingenciasComponent } from './lista-contingencias/lista-contingencias.component';
import { AuthGuard } from '../auth/auth.guard';
import { GuessGuard } from '../auth/guess.guard';


const routes: Routes = [
  { path: 'llenar-formulario', component: FormularioComponent, data: { hideHeader: true } },//canActivate: [GuessGuard]
  { path: 'llenar-formulario-sistema', component: FormularioComponent },//canActivate: [GuessGuard]
  { path: 'contingencias', component: ListaContingenciasComponent },
  { path: 'mapa', component: MapaComponent }//canActivate: [GuessGuard]
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
