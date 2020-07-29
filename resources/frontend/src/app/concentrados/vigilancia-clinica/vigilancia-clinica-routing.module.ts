import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CamasComponent } from './camas/camas.component';
import { AuthGuard } from '../../auth/auth.guard';


const routes: Routes = [
  { path: 'concentrados/vigilancia-clinica', component: CamasComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VigilanciaClinicaRoutingModule { }
