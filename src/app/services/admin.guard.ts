import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = async (_, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ensureSession();
  if (auth.status() === 'error') {
    return router.parseUrl('/erreur-session');
  }
  if (!auth.user()) {
    return router.createUrlTree(['/connexion'], { queryParams: { returnUrl: state.url } });
  }
  return auth.isAdmin() ? true : router.parseUrl('/acces-refuse');
};
