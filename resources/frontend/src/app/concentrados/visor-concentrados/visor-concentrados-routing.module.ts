import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisorConcentradosComponent } from './visor/visor-concentrados.component';
import { AuthGuard } from '../../auth/auth.guard';


const routes: Routes = [
  { path: 'concentrados/casos-concentrados', component: VisorConcentradosComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisorRoutingModule { }
