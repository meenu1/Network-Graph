import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserFormComponent } from './user/user-form.component';
import { NetworkGraphComponent } from './network/network-graph.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserFormComponent
  },
  {
    path: 'network-graph',
    component: NetworkGraphComponent
  },
   { path: '',   redirectTo: '/user', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
