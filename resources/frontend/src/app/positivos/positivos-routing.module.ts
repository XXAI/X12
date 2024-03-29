import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaComponent } from './lista/lista.component';
import { FormularioComponent } from './formulario/formulario.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
  { path: 'casos-positivos', component: ListaComponent, canActivate: [AuthGuard]  },
  { path: 'casos-positivos/nuevo', component: FormularioComponent, canActivate: [AuthGuard]  },
  { path: 'casos-positivos/editar/:id', component: FormularioComponent, canActivate: [AuthGuard]  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositivosRoutingModule { }
