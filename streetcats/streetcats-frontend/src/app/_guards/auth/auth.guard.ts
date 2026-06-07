import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../_services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  if (authService.isUserAuthenticated()) {
    return true;
  }

  // Se non loggato, mostra avviso e reindirizza al login
  toastr.warning('Devi effettuare l\'accesso per visualizzare questa pagina.', 'Non autorizzato!');
  return router.parseUrl('/login');
};
