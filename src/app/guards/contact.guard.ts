import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const contactGuard: CanActivateFn = (route, state) => {
  const router=inject(Router);
 
   const isAllowed=localStorage.getItem('role')=="Commercial";
   const isAllowed2=localStorage.getItem('role')=="Manager De Production";
   const isAllowed3=localStorage.getItem('role')=="Directeur Associé";
   if(isAllowed || isAllowed2 || isAllowed3){
     return true;
 }else{
   router.navigate(['/Contact']);
   return false;
 }
};
