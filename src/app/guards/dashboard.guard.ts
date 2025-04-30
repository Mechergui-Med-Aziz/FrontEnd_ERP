import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const dashboardGuard: CanActivateFn = (route, state) => {
  
  const router=inject(Router);
    
      const isAllowed=localStorage.getItem('role')=="Directeur Associé";
      if(isAllowed){
        return true;
    }else{
      router.navigate(['/home']);
      return false;
    }
};
