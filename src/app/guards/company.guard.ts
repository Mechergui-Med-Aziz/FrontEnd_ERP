import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const companyGuard: CanActivateFn = (route, state) => {
  const router=inject(Router);

  const isAllowed=localStorage.getItem('role')!="Administrateur";
      if(isAllowed){
        return true;
    }else{
      router.navigate(['/users-accounts']);
      return false;
    }
};
