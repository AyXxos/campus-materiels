import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async (_, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ensureSession();
  if (auth.status() === 'error') {
    return router.parseUrl('/erreur-session');
  }
  return auth.user()
    ? true
    : router.createUrlTree(['/connexion'], { queryParams: { returnUrl: state.url } });
};
