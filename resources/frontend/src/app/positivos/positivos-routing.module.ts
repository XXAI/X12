import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaComponent } from './lista/lista.component';
import { FormularioComponent } from './formulario/formulario.component';


const routes: Routes = [
  { path: 'casos-positivos', component: ListaComponent },
  { path: 'casos-positivos/nuevo', component: FormularioComponent },
  { path: 'casos-positivos/editar/:id', component: FormularioComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositivosRoutingModule { }
