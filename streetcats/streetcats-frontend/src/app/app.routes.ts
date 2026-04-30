import { Routes } from '@angular/router';
import { CatList }   from './cat-list/cat-list';
import { CatDetail } from './cat-detail/cat-detail';
import { CatForm }   from './cat-form/cat-form';
import { Login }     from './login/login';
import { Signup }    from './signup/signup';
import { Profile }   from './profile/profile';
import { authGuard } from './_guards/auth/auth.guard';

export const routes: Routes = [
  { path: '',               redirectTo: '/cats', pathMatch: 'full' },
  { path: 'cats',           component: CatList },
  { path: 'cats/new',       component: CatForm,   canActivate: [authGuard] },
  { path: 'cats/:id',       component: CatDetail },
  { path: 'cats/:id/edit',  component: CatForm,   canActivate: [authGuard] },
  { path: 'login',          component: Login },
  { path: 'signup',         component: Signup },
  { path: 'profile',        component: Profile,   canActivate: [authGuard] },
  { path: '**',             redirectTo: '/cats' }
];
