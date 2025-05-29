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
      {
        path: 'users',
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/admin/users/user-list/user-list.component').then(m => m.UserListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/admin/users/user-form/user-form.component').then(m => m.UserFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/admin/users/user-form/user-form.component').then(m => m.UserFormComponent)
          }
        ]
      },
      {
        path: 'projects',
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/projects/project-list/project-list.component').then(m => m.ProjectListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/projects/project-form/project-form.component').then(m => m.ProjectFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/projects/project-form/project-form.component').then(m => m.ProjectFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/projects/project-details/project-details.component').then(m => m.ProjectDetailsComponent)
          }
        ]
      },
      {
        path: 'sites',
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/sites/site-list/site-list.component').then(m => m.SiteListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/sites/site-form/site-form.component').then(m => m.SiteFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/sites/site-form/site-form.component').then(m => m.SiteFormComponent)
          }
        ]
      },
      {
        path: 'vendors',
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/vendors/vendor-list/vendor-list.component').then(m => m.VendorListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/vendors/vendor-form/vendor-form.component').then(m => m.VendorFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/vendors/vendor-form/vendor-form.component').then(m => m.VendorFormComponent)
          }
        ]
      },
      {
        path: 'tasks',
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/tasks/task-list/task-list.component').then(m => m.TaskListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/tasks/task-form/task-form.component').then(m => m.TaskFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/tasks/task-form/task-form.component').then(m => m.TaskFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/tasks/task-details/task-details.component').then(m => m.TaskDetailsComponent)
          }
        ]
      },
      {
        path: 'materials',
        loadChildren: () => import('./features/material/material.module').then(m => m.MaterialModule),
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER] }
      },
      {
        path: 'documents',
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER, Role.CLIENT] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/documents/document-list/document-list.component').then(m => m.DocumentListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/documents/document-form/document-form.component').then(m => m.DocumentFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/documents/document-form/document-form.component').then(m => m.DocumentFormComponent)
          }
        ]
      },
      {
        path: 'invoices',
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/invoice/invoice-list/invoice-list.component').then(m => m.InvoiceListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/invoice/create-invoice/create-invoice.component').then(m => m.CreateInvoiceComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/invoice/invoice-details/invoice-details.component').then(m => m.InvoiceDetailsComponent)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
