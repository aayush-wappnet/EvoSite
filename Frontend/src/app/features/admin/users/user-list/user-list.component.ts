import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Role } from '../../../../core/constants';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>User Management</h2>
        <button class="btn-primary" routerLink="create">
          <i class="fas fa-plus"></i> Add New User
        </button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.createdAt | date:'medium' }}</td>
              <td class="actions">
                <button class="btn-icon" [routerLink]="['edit', user.id]" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" (click)="openDeleteConfirmation(user)" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Delete Confirmation Dialog -->
      <div class="dialog-overlay" *ngIf="showDeleteDialog" (click)="closeDeleteConfirmation()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h3><i class="fas fa-exclamation-triangle"></i> Confirm Deletion</h3>
          </div>
          <div class="dialog-content">
            <p>Are you sure you want to delete the user "{{ userToDelete?.name }}"?</p>
            <p class="warning">This action cannot be undone.</p>
          </div>
          <div class="dialog-actions">
            <button class="btn-secondary" (click)="closeDeleteConfirmation()">
              <i class="fas fa-times"></i> Cancel
            </button>
            <button class="btn-danger" (click)="confirmDelete()">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h2 {
        margin: 0;
        color: #2c3e50;
      }
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.2s;

      &:hover {
        background-color: #2980b9;
      }
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
      }

      th {
        background-color: #f8f9fa;
        font-weight: 600;
        color: #2c3e50;
      }

      tr:hover {
        background-color: #f8f9fa;
      }
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #eee;
      }

      &.delete:hover {
        background-color: #ffebee;
        color: #e53935;
      }

      i {
        font-size: 1rem;
      }
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      overflow: hidden;
    }

    .dialog-header {
      padding: 1rem;
      background-color: #f8f9fa;
      border-bottom: 1px solid #eee;

      h3 {
        margin: 0;
        color: #2c3e50;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        i {
          color: #e53935;
        }
      }
    }

    .dialog-content {
      padding: 1.5rem;

      p {
        margin: 0 0 1rem;
        color: #2c3e50;

        &.warning {
          color: #e53935;
          font-size: 0.875rem;
        }
      }
    }

    .dialog-actions {
      padding: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      border-top: 1px solid #eee;
    }

    .btn-secondary {
      background-color: #95a5a6;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.2s;

      &:hover {
        background-color: #7f8c8d;
      }
    }

    .btn-danger {
      background-color: #e53935;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.2s;

      &:hover {
        background-color: #c62828;
      }
    }
  `]
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private destroy$ = new Subject<void>();
  showDeleteDialog = false;
  userToDelete: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.users = users;
      });
  }

  openDeleteConfirmation(user: User): void {
    this.userToDelete = user;
    this.showDeleteDialog = true;
  }

  closeDeleteConfirmation(): void {
    this.showDeleteDialog = false;
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadUsers();
          this.closeDeleteConfirmation();
        });
    }
  }
} 