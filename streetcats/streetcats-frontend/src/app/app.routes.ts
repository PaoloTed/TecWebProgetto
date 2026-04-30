import { Routes } from '@angular/router';
import { CatList } from './cat-list/cat-list';
import { Login } from './login/login';
import { CatDetail } from './cat-detail/cat-detail';
import { CatForm } from './cat-form/cat-form';
import { Profile } from './profile/profile';
import { authGuard } from './_guards/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/cats', pathMatch: 'full' },
  { path: 'cats', component: CatList },
  { path: 'cats/new', component: CatForm, canActivate: [authGuard] },
  { path: 'cats/:id', component: CatDetail },
  { path: 'login', component: Login },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: '**', redirectTo: '/cats' }
];
