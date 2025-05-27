import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task.model';
import { TaskStatus } from '../../../core/constants/task-status.enum';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/constants/role.enum';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error = '';
  TaskStatus = TaskStatus;
  Role = Role;
  currentUserRole: Role | null = null;
  showDeleteConfirm = false;
  taskToDelete: Task | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserRole = user?.role || null;
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getAllTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load tasks';
        this.loading = false;
        console.error('Error loading tasks:', error);
      }
    });
  }

  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'task-card__status--completed';
      case TaskStatus.IN_PROGRESS:
        return 'task-card__status--in-progress';
      case TaskStatus.PENDING:
        return 'task-card__status--pending';
      default:
        return '';
    }
  }

  canCreateTask(): boolean {
    return this.currentUserRole === Role.ADMIN || this.currentUserRole === Role.SITE_ENGINEER;
  }

  canUpdateTask(): boolean {
    return this.currentUserRole === Role.ADMIN || this.currentUserRole === Role.SITE_ENGINEER;
  }

  canDeleteTask(): boolean {
    return this.currentUserRole === Role.ADMIN;
  }

  onEdit(task: Task): void {
    if (this.canUpdateTask()) {
      this.router.navigate(['/tasks/edit', task.id]);
    }
  }

  onDelete(task: Task): void {
    if (this.canDeleteTask()) {
      this.taskToDelete = task;
      this.showDeleteConfirm = true;
    }
  }

  confirmDelete(): void {
    if (this.taskToDelete && this.canDeleteTask()) {
      this.taskService.deleteTask(this.taskToDelete.id).subscribe({
        next: () => {
          this.loadTasks();
          this.showDeleteConfirm = false;
          this.taskToDelete = null;
        },
        error: (error: any) => {
          this.error = 'Failed to delete task';
          console.error('Error deleting task:', error);
          this.showDeleteConfirm = false;
          this.taskToDelete = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.taskToDelete = null;
  }

  onViewDetails(task: Task): void {
    this.router.navigate(['/tasks', task.id]);
  }
} 