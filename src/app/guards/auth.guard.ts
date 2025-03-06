import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  const isAuthenticated = !!localStorage.getItem('token');
  
  if (isAuthenticated) {
    return true;  
  } else {
    router.navigate(['/login']);  
    return false; 
  }
};
