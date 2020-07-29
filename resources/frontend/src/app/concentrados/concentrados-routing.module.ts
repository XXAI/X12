import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ConcentradosComponent } from './concentrados.component';

const routes: Routes = [
  { path: 'concentrados', component: ConcentradosComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConcentradosRoutingModule { }
