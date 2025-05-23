import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { Role } from '../../../../core/constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>
          <i class="fas" [class.fa-user-plus]="!isEditMode" [class.fa-user-edit]="isEditMode"></i>
          {{ isEditMode ? 'Edit User' : 'Create User' }}
        </h2>
      </div>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="form-container">
        <div class="form-group">
          <label for="name">
            <i class="fas fa-user"></i>
            Name
          </label>
          <input 
            type="text" 
            id="name" 
            formControlName="name" 
            placeholder="Enter name"
            [class.error]="userForm.get('name')?.invalid && userForm.get('name')?.touched"
          >
          <div class="error-message" *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched">
            Name is required
          </div>
        </div>

        <div class="form-group">
          <label for="email">
            <i class="fas fa-envelope"></i>
            Email
          </label>
          <input 
            type="email" 
            id="email" 
            formControlName="email" 
            placeholder="Enter email"
            [class.error]="userForm.get('email')?.invalid && userForm.get('email')?.touched"
          >
          <div class="error-message" *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
            Please enter a valid email
          </div>
        </div>

        <div class="form-group">
          <label for="password">
            <i class="fas fa-lock"></i>
            Password
          </label>
          <div class="password-input-container">
            <input 
              [type]="showPassword ? 'text' : 'password'"
              id="password" 
              formControlName="password" 
              placeholder="Enter password"
              [class.error]="userForm.get('password')?.invalid && userForm.get('password')?.touched"
            >
            <button 
              type="button" 
              class="toggle-password" 
              (click)="togglePasswordVisibility()"
              [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
            >
              <i class="fas" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
            </button>
          </div>
          <div class="error-message" *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched">
            Password must be at least 6 characters
          </div>
        </div>

        <div class="form-group">
          <label>
            <i class="fas fa-user-tag"></i>
            Role
          </label>
          <div class="radio-group">
            <div class="radio-option" *ngFor="let role of roles">
              <input 
                type="radio" 
                [id]="'role-' + role" 
                formControlName="role" 
                [value]="role"
                [class.error]="userForm.get('role')?.invalid && userForm.get('role')?.touched"
              >
              <label [for]="'role-' + role">
                <i [class]="getRoleIcon(role)"></i>
                {{ role }}
              </label>
            </div>
          </div>
          <div class="error-message" *ngIf="userForm.get('role')?.invalid && userForm.get('role')?.touched">
            Role is required
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" (click)="goBack()">
            <i class="fas fa-times"></i>
            Cancel
          </button>
          <button type="submit" class="btn-primary" [disabled]="userForm.invalid">
            <i class="fas" [class.fa-save]="isEditMode" [class.fa-plus]="!isEditMode"></i>
            {{ isEditMode ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 1.5rem;
      margin-left:200px;
    }

    .header {
      margin-bottom: 2rem;

      h2 {
        margin: 0;
        color: #2c3e50;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        i {
          color: #3498db;
        }
      }
    }

    .form-container {
      max-width: 600px;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        color: #2c3e50;
        font-weight: 500;

        i {
          color: #3498db;
        }
      }

      input[type="text"],
      input[type="email"],
      input[type="password"] {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #3498db;
        }

        &.error {
          border-color: #e74c3c;
        }
      }
    }

    .password-input-container {
      position: relative;
      display: flex;
      align-items: center;

      input {
        padding-right: 40px;
      }

      .toggle-password {
        position: absolute;
        right: 10px;
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          color: #3498db;
        }

        i {
          font-size: 1rem;
        }
      }
    }

    .radio-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background-color: #f8f9fa;
      }

      input[type="radio"] {
        margin: 0;
      }

      label {
        margin: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        i {
          color: #3498db;
        }
      }

      input[type="radio"]:checked + label {
        color: #3498db;
        font-weight: 500;
      }
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      i {
        font-size: 1rem;
      }
    }

    .btn-primary {
      background-color: #3498db;
      color: white;

      &:hover:not(:disabled) {
        background-color: #2980b9;
      }
    }

    .btn-secondary {
      background-color: #95a5a6;
      color: white;

      &:hover {
        background-color: #7f8c8d;
      }
    }
  `]
})
export class UserFormComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  isEditMode = false;
  roles = Object.values(Role).filter(role => role !== Role.ADMIN);
  private destroy$ = new Subject<void>();
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.isEditMode = true;
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      
      this.userService.getUser(userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(user => {
          this.userForm.patchValue({
            name: user.name,
            email: user.email,
            role: user.role
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getRoleIcon(role: Role): string {
    switch (role) {
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

  onSubmit(): void {
    if (this.userForm.valid) {
      const userId = this.route.snapshot.paramMap.get('id');
      const userData = this.userForm.value;

      if (this.isEditMode && userId) {
        this.userService.updateUser(userId, userData)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.router.navigate(['/users']);
          });
      } else {
        this.userService.createUser(userData)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.router.navigate(['/users']);
          });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
} 