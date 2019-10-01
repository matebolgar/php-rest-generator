import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuardService} from './auth/authguard.service';
import {ContainerComponent} from './container/container.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';

const routes: Routes = [
  {
    path: '', component: ContainerComponent, children: [
      {
        path: '', component: MainComponent, children: [
          {path: '', component: DashboardComponent},
        ]
      },
    ],
    // canActivate: [AuthGuardService],
  },
  {path: 'login', component: LoginComponent},
  // {
  //   path: '**',
  //   redirectTo: '/',
  //   pathMatch: 'full'
  // },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
