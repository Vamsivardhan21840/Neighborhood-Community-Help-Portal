import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Registration } from './features/registration/registration';
import { Login } from './features/login/login';
import { HelpRequest } from './features/help-request/help-request';
import { RequestList } from './features/request-list/request-list';
import { Dashboard } from './features/dashboard/dashboard';
import { Profile } from './features/profile/profile';
import { RequestStatus } from './features/request-status/request-status';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'register', component: Registration },
  { path: 'login', component: Login },
  {
    path: 'requests',
    component: RequestList,
    canActivate: [AuthGuard],
    data: { role: 'Helper' }
  },
  {
    path: 'requests/new',
    component: HelpRequest,
    canActivate: [AuthGuard],
    data: { role: 'Resident' }
  },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
  { path: 'requests/:id/status', component: RequestStatus, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
