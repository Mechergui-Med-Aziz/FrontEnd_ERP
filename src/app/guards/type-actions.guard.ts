import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TypeActionsService } from '../services/type-actions.service';

export const typeActionsGuard: CanActivateFn = (route, state) => {
  const router=inject(Router);
  const auth=inject(TypeActionsService);

  const isAllowed=localStorage.getItem('role')=="Manager";
  if(isAllowed){
    return true;
}else{
  router.navigate(['/home']);
  return false;
}
};
