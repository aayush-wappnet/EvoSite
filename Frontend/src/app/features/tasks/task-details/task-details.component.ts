import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';
import { Task, TaskDependency } from '../../../core/models/task.model';
import { User } from '../../../core/models/user.model';
import { TaskStatus } from '../../../core/constants/task-status.enum';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/constants/role.enum';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class TaskDetailsComponent implements OnInit {
  task: Task | null = null;
  loading = true;
  error: string | null = null;
  TaskStatus = TaskStatus;
  Role = Role;
  currentUserRole: Role | null = null;
  showConfirmDialog = false;
  showAssignDialog = false;
  isDependencyDialogVisible = false;
  selectedContractorId = '';
  selectedDependentTaskId = '';
  siteEngineers: User[] = [];
  contractors: User[] = [];
  availableTasks: Task[] = [];
  dependencies: TaskDependency[] = [];
  dependentTasks: Map<string, Task> = new Map();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserRole = user?.role || null;
    });
  }

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTaskDetails(taskId);
      this.loadUsers();
      this.loadAvailableTasks();
      this.loadDependencies(taskId);
    }
  }

  // Helper methods for template
  hasAssignedUsers(): boolean {
    return this.task?.users !== undefined && this.task.users.length > 0;
  }

  getAssignedUsers(): User[] {
    return this.task?.users || [];
  }

  loadTaskDetails(taskId: string): void {
    this.loading = true;
    this.error = null;

    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.task = task;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading task details:', error);
        this.error = 'Failed to load task details';
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    // Only load contractors and site engineers if user is admin
    if (this.currentUserRole === Role.ADMIN) {
      this.loadContractors();
      this.loadSiteEngineers();
    }
  }

  canLoadSiteEngineers(): boolean {
    return this.currentUserRole === Role.ADMIN;
  }

  loadSiteEngineers(): void {
    this.userService.getSiteEngineers().subscribe({
      next: (engineers) => {
        this.siteEngineers = engineers;
      },
      error: (error) => {
        console.error('Error loading site engineers:', error);
        // Don't show error to user if they don't have permission
        if (error.status !== 403) {
          this.error = 'Failed to load site engineers';
        }
      }
    });
  }

  loadContractors(): void {
    this.userService.getContractors().subscribe({
      next: (contractors) => {
        this.contractors = contractors;
      },
      error: (error) => {
        console.error('Error loading contractors:', error);
        this.error = 'Failed to load contractors';
      }
    });
  }

  loadAvailableTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        // Filter out the current task and tasks that are already dependencies
        this.availableTasks = tasks.filter(task => 
          task.id !== this.task?.id && 
          !this.dependencies.some(dep => dep.dependentTaskId === task.id)
        );
      },
      error: (error) => {
        console.error('Error loading available tasks:', error);
      }
    });
  }

  loadDependencies(taskId: string): void {
    this.taskService.getTaskDependencies(taskId).subscribe({
      next: (dependencies) => {
        this.dependencies = dependencies;
        // Load details for each dependent task
        dependencies.forEach(dependency => {
          this.loadDependentTaskDetails(dependency.dependentTaskId);
        });
      },
      error: (error) => {
        console.error('Error loading dependencies:', error);
      }
    });
  }

  loadDependentTaskDetails(taskId: string): void {
    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.dependentTasks.set(taskId, task);
      },
      error: (error) => {
        console.error('Error loading dependent task details:', error);
      }
    });
  }

  getDependentTask(taskId: string): Task | undefined {
    return this.dependentTasks.get(taskId);
  }

  canEditTask(): boolean {
    return this.currentUserRole === Role.ADMIN || this.currentUserRole === Role.SITE_ENGINEER;
  }

  canDeleteTask(): boolean {
    return this.currentUserRole === Role.ADMIN;
  }

  canAssignUser(): boolean {
    return this.currentUserRole === Role.ADMIN;
  }

  showAssignUserDialog(): void {
    this.showAssignDialog = true;
  }

  cancelAssign(): void {
    this.showAssignDialog = false;
    this.selectedContractorId = '';
  }

  assignUser(): void {
    if (!this.task || !this.selectedContractorId) return;

    this.taskService.assignUser(this.task.id, this.selectedContractorId).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
        this.showAssignDialog = false;
        this.selectedContractorId = '';
      },
      error: (error) => {
        this.error = 'Failed to assign user';
        console.error('Error assigning user:', error);
      }
    });
  }

  removeUser(userId: string): void {
    if (!this.task) return;

    this.taskService.removeUser(this.task.id, userId).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
      },
      error: (error) => {
        this.error = 'Failed to remove user';
        console.error('Error removing user:', error);
      }
    });
  }

  updateTaskStatus(status: TaskStatus): void {
    if (!this.task) return;

    this.taskService.updateTask(this.task.id, { status }).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
      },
      error: (error) => {
        this.error = 'Failed to update task status';
        console.error('Error updating task status:', error);
      }
    });
  }

  updateTaskProgress(progress: number): void {
    if (!this.task) return;

    this.taskService.updateTask(this.task.id, { progress }).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
      },
      error: (error) => {
        this.error = 'Failed to update task progress';
        console.error('Error updating task progress:', error);
      }
    });
  }

  onEdit(): void {
    if (this.task) {
      this.router.navigate(['/tasks/edit', this.task.id]);
    }
  }

  onDelete(): void {
    this.showConfirmDialog = true;
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
  }

  confirmDelete(): void {
    if (this.task) {
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.error = 'Failed to delete task';
        }
      });
    }
  }

  showDependencyDialog(): void {
    this.isDependencyDialogVisible = true;
    this.loadAvailableTasks(); // Refresh available tasks
  }

  cancelDependency(): void {
    this.isDependencyDialogVisible = false;
    this.selectedDependentTaskId = '';
  }

  createDependency(): void {
    if (!this.task || !this.selectedDependentTaskId) return;

    this.taskService.createDependency(
      this.task.id,
      this.selectedDependentTaskId
    ).subscribe({
      next: (dependency) => {
        this.dependencies.push(dependency);
        this.loadDependentTaskDetails(dependency.dependentTaskId);
        this.isDependencyDialogVisible = false;
        this.selectedDependentTaskId = '';
        this.loadAvailableTasks(); // Refresh available tasks
      },
      error: (error) => {
        console.error('Error creating dependency:', error);
      }
    });
  }
} 