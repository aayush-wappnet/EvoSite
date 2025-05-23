import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../constants/role.enum';

export const RoleGuard: (allowedRoles: Role[]) => CanActivateFn = (allowedRoles) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getUser();
    
    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    // Redirect to dashboard if user doesn't have required role
    router.navigate(['/dashboard']);
    return false;
  };
}; 