import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Role } from '../../../core/constants';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: Role[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-th-large',
      route: '/dashboard',
      roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER, Role.CLIENT]
    },
    {
      label: 'Users',
      icon: 'fas fa-users',
      route: '/users',
      roles: [Role.ADMIN]
    },
    {
      label: 'Projects',
      icon: 'fas fa-briefcase',
      route: '/projects',
      roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER]
    },
    {
      label: 'Sites',
      icon: 'fas fa-building',
      route: '/sites',
      roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER]
    },
    {
      label: 'Tasks',
      icon: 'fas fa-tasks',
      route: '/tasks',
      roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER]
    },
    {
      label: 'Materials',
      icon: 'fas fa-boxes',
      route: '/materials',
      roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER]
    },
    {
      label: 'Documents',
      icon: 'fas fa-file-alt',
      route: '/documents',
      roles: [Role.ADMIN, Role.CONTRACTOR, Role.SITE_ENGINEER, Role.CLIENT]
    },
    {
      label: 'Invoices',
      icon: 'fas fa-file-invoice',
      route: '/invoices',
      roles: [Role.ADMIN, Role.CONTRACTOR]
    },
    {
      label: 'Vendors',
      icon: 'fas fa-truck',
      route: '/vendors',
      roles: [Role.ADMIN]
    }
  ];

  filteredNavItems: NavItem[] = [];
  currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((user: User | null) => {
      this.currentUser = user;
      this.filterNavItems();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterNavItems(): void {
    if (!this.currentUser) {
      this.filteredNavItems = [];
      return;
    }
    this.filteredNavItems = this.navItems.filter(item =>
      item.roles.includes(this.currentUser!.role)
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getRoleIcon(): string {
    if (!this.currentUser) return 'fas fa-user';
    
    switch (this.currentUser.role) {
      case Role.ADMIN:
        return 'fas fa-user-shield';
      case Role.CONTRACTOR:
        return 'fas fa-hard-hat';
      case Role.SITE_ENGINEER:
        return 'fas fa-user-cog';
      case Role.CLIENT:
        return 'fas fa-user-tie';
      default:
        return 'fas fa-user';
    }
  }
} 