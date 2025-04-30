import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const typeActionsGuard: CanActivateFn = (route, state) => {
  const router=inject(Router);

  const isAllowed=localStorage.getItem('role')=="Commercial";
  const isAllowed2=localStorage.getItem('role')=="Directeur Associé";
  if(isAllowed || isAllowed2){
    return true;
}else{
  router.navigate(['/home']);
  return false;
}
};
