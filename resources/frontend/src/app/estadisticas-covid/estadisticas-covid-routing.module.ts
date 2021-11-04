import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormularioComponent } from './formulario/formulario.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
  //{ path: 'estadisticcas-covid', component: ListaComponent, canActivate: [AuthGuard] },
  { path: 'estadisticas-covid/nuevo', component: FormularioComponent, canActivate: [AuthGuard] },
  //{ path: 'semaforo/editar/:id', component: FormularioComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadisticasCovidRoutingModule { }
