import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { Role } from '../../core/constants/role.enum';
import { Project } from '../../core/models/project.model';
import { Task } from '../../core/models/task.model';
import { Subscription } from 'rxjs';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { gantt } from 'dhtmlx-gantt';

interface GanttTask {
  id: string;
  text: string;
  start_date: string;
  end_date: string;
  progress: number;
  parent?: string;
  open?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: any = null;
  loading = true;
  error: string | null = null;
  role: Role | null = null;
  activeTab: 'stats' | 'gantt' = 'stats';
  projects: Project[] = [];
  tasks: Task[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.role = user.role;
      this.loadStats();
      this.loadProjects();
      this.loadTasks();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (gantt && typeof gantt['destroy'] === 'function') {
      gantt['destroy']();
    }
  }

  loadStats(): void {
    if (!this.role) return;

    this.loading = true;
    this.error = null;

    this.dashboardService.getStatsByRole(this.role).subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard statistics';
        this.loading = false;
        console.error('Dashboard error:', err);
      }
    });
  }

  loadProjects(): void {
    this.subscriptions.push(
      this.projectService.getAllProjects().subscribe({
        next: (projects) => {
          this.projects = projects;
          if (this.activeTab === 'gantt') {
            this.initializeGantt();
          }
        },
        error: (err) => {
          console.error('Failed to load projects:', err);
        }
      })
    );
  }

  loadTasks(): void {
    this.subscriptions.push(
      this.taskService.getAllTasks().subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          if (this.activeTab === 'gantt') {
            this.initializeGantt();
          }
        },
        error: (err) => {
          console.error('Failed to load tasks:', err);
        }
      })
    );
  }

  private formatDate(date: Date | string | undefined): string {
    if (!date) return new Date().toISOString();
    if (typeof date === 'string') return date;
    return date.toISOString();
  }

  initializeGantt(): void {
    const ganttContainer = document.getElementById('gantt-container');
    if (!ganttContainer) return;

    gantt.config['date_format'] = "%Y-%m-%d %H:%i";
    gantt.config['scale_unit'] = "day";
    gantt.config['date_scale'] = "%d %M";
    gantt.config['subscales'] = [
      { unit: "hour", step: 6, date: "%H:%i" }
    ];

    gantt.config.columns = [
      { name: "text", label: "Task name", tree: true, width: '*' },
      { name: "start_date", label: "Start date", align: "center" },
      { name: "end_date", label: "End date", align: "center" },
      { name: "progress", label: "Progress", align: "center" }
    ];

    gantt.templates.progress_text = (start: Date, end: Date, task: any) => {
      return Math.round((task.progress || 0) * 100) + "%";
    };

    gantt.init(ganttContainer);

    // Convert tasks to Gantt format
    const ganttTasks: GanttTask[] = this.tasks.map(task => ({
      id: task.id,
      text: task.title,
      start_date: this.formatDate(task.startDate),
      end_date: this.formatDate(task.endDate),
      progress: task.progress / 100,
      parent: task.projectId
    }));

    // Add projects as parent tasks
    const projectTasks: GanttTask[] = this.projects.map(project => ({
      id: project.id,
      text: project.name,
      start_date: this.formatDate(project.startDate),
      end_date: this.formatDate(project.endDate),
      progress: 0,
      open: true
    }));

    gantt.parse({
      data: [...projectTasks, ...ganttTasks]
    });
  }

  switchTab(tab: 'stats' | 'gantt'): void {
    this.activeTab = tab;
    if (tab === 'gantt') {
      setTimeout(() => this.initializeGantt(), 0);
    }
  }

  getStatusDistributionKeys(distribution: any): string[] {
    return Object.keys(distribution || {});
  }

  getStatusDistributionValue(distribution: any, key: string): number {
    return distribution[key] || 0;
  }

  getRoleIcon(role: string): string {
    const iconMap: { [key: string]: string } = {
      'Admin': 'fas fa-user-shield',
      'Contractor': 'fas fa-hard-hat',
      'Site Engineer': 'fas fa-user-cog',
      'Client': 'fas fa-user-tie',
      'Project Manager': 'fas fa-user-tie',
      'Worker': 'fas fa-user-hard-hat',
      'Supplier': 'fas fa-truck',
      'Architect': 'fas fa-drafting-compass',
      'Consultant': 'fas fa-user-graduate'
    };
    return iconMap[role] || 'fas fa-user';
  }
} 