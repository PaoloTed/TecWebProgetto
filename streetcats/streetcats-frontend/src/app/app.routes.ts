import { Routes } from '@angular/router';
import { CatList } from './cat-list/cat-list.component';
import { CatDetail } from './cat-detail/cat-detail.component';
import { CatForm } from './cat-form/cat-form.component';
import { Login } from './login/login.component';
import { Signup } from './signup/signup.component';
import { Profile } from './profile/profile.component';
import { authGuard } from './_guards/auth/auth.guard';
import { noAuthGuard } from './_guards/no-auth/no-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/cats', pathMatch: 'full' },
  { path: 'cats', component: CatList },
  { path: 'cats/new', component: CatForm, canActivate: [authGuard] },
  { path: 'cats/:id', component: CatDetail },
  { path: 'cats/:id/edit', component: CatForm, canActivate: [authGuard] },
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  { path: 'signup', component: Signup, canActivate: [noAuthGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: '**', redirectTo: '/cats' }
];
