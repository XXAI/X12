import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ListaLlamadasComponent } from './lista-llamadas/lista-llamadas.component';
import { LlamadaComponent } from './llamada/llamada.component';


const routes: Routes = [
  { path: 'call-center', component: ListaLlamadasComponent, canActivate: [AuthGuard] },
  { path: 'call-center/llamada/:id', component: LlamadaComponent, canActivate: [AuthGuard] },
  { path: 'call-center/llamada', component: LlamadaComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallCenterRoutingModule { }
