import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { FormComponent } from './form/form.component';
import { IndexComponent } from './index/index.component';


const routes: Routes = [
  { path: 'casos-sospechosos', component: IndexComponent, canActivate: [AuthGuard]  },

  {
    path:'casos-sospechosos/agregar',
    component: FormComponent,
  },
  {
    path:'casos-sospechosos/:id',
    component: FormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasosSospechososRoutingModule { }
