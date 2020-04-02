import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ListaLlamadasComponent } from './lista-llamadas/lista-llamadas.component';


const routes: Routes = [
  { path: 'call-center', component: ListaLlamadasComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallCenterRoutingModule { }
