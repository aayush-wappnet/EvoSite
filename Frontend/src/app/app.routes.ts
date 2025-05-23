import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { Role } from './core/constants';
import { RoleGuard } from './core/guards/role.guard';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER, Role.CLIENT] }
      },
      // {
      //   path: 'users',
      //   loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
      //   canActivate: [RoleGuard],
      //   data: { roles: [Role.ADMIN] }
      // },
      // {
      //   path: 'projects',
      //   loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent),
      //   canActivate: [RoleGuard],
      //   data: { roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER] }
      // },
      // {
      //   path: 'tasks',
      //   loadComponent: () => import('./features/tasks/tasks.component').then(m => m.TasksComponent),
      //   canActivate: [RoleGuard],
      //   data: { roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER] }
      // },
      // {
      //   path: 'materials',
      //   loadComponent: () => import('./features/materials/materials.component').then(m => m.MaterialsComponent),
      //   canActivate: [RoleGuard],
      //   data: { roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER] }
      // },
      // {
      //   path: 'documents',
      //   loadComponent: () => import('./features/documents/documents.component').then(m => m.DocumentsComponent),
      //   canActivate: [RoleGuard],
      //   data: { roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER, Role.CLIENT] }
      // },
      // {
      //   path: 'invoices',
      //   loadComponent: () => import('./features/invoices/invoices.component').then(m => m.InvoicesComponent),
      //   canActivate: [RoleGuard],
      //   data: { roles: [Role.ADMIN, Role.CONTRACTOR] }
      // },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
