import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaComponent } from './lista/lista.component';
import { FormularioComponent } from './formulario/formulario.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
  { path: 'vigilancia-clinica', component: ListaComponent, canActivate: [AuthGuard] },
  { path: 'vigilancia-clinica/nuevo', component: FormularioComponent, canActivate: [AuthGuard] },
  { path: 'vigilancia-clinica/editar/:id', component: FormularioComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VigilanciaClinicaRoutingModule { }
