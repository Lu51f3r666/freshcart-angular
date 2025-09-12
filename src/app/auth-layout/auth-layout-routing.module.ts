import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../../components/auth/signin/signin.module').then(m => m.SigninModule)
      },
      {
        path: 'signin',
        loadChildren: () => import('../../components/auth/signin/signin.module').then(m => m.SigninModule)
      },
      {
        path: 'signup',
        loadChildren: () => import('../../components/auth/signup/signup.module').then(m => m.SignupModule)
      },
      {
        path: 'forgot-password',
        loadChildren: () => import('../../components/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
      },
      {
        path: 'verify-reset-code',
        loadChildren: () => import('../../components/auth/verify-reset-code/verify-reset-code.module').then(m => m.VerifyResetCodeModule)
      },
      {
        path: 'reset-password',
        loadChildren: () => import('../../components/auth/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthLayoutRoutingModule { } 