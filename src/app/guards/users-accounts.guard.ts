import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const usersAccountsGuard: CanActivateFn = (route, state) => {
  const router=inject(Router);
  
    const isAllowed=localStorage.getItem('role')=="Administrateur";
    if(isAllowed){
      return true;
  }else{
    router.navigate(['/home']);
    return false;
  }
};
