import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const companyGuard: CanActivateFn = (route, state) => {
  const router=inject(Router);

  const isAllowed=localStorage.getItem('role')=="Commercial";
  const isAllowed2=localStorage.getItem('role')=="Directeur Associé";
  if(isAllowed || isAllowed2){
    return true;
}else{
  router.navigate(['/company']);
  return false;
}
};
