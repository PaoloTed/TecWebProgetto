import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../_services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUserAuthenticated()) {
    return true;
  }

  // Se non loggato, mostra avviso e reindirizza al login
  alert('Devi effettuare l\'accesso per visualizzare questa pagina.');
  return router.parseUrl('/login');
};
