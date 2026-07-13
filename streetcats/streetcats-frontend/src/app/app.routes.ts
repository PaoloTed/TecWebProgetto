import { Routes } from '@angular/router';
import { CatHomepage } from './ui/cat-homepage/cat-homepage.component';
import { CatDetail } from './ui/cat-detail/cat-detail.component';
import { CatForm } from './ui/cat-form/cat-form.component';
import { Login } from './ui/login/login.component';
import { Signup } from './ui/signup/signup.component';
import { Profile } from './ui/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/cats', pathMatch: 'full' },
  { path: 'cats', component: CatHomepage },
  { path: 'cats/new', component: CatForm, canActivate: [authGuard] },
  { path: 'cats/:id', component: CatDetail },
  { path: 'cats/:id/edit', component: CatForm, canActivate: [authGuard] },
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  { path: 'signup', component: Signup, canActivate: [noAuthGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: '**', redirectTo: '/cats' }
];
