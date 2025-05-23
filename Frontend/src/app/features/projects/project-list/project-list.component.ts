import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models';
import { Role } from '../../../core/constants';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'project-list.component.html',
  styleUrls: ['project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  hasAdminAccess = false;

  constructor(private projectService: ProjectService) {
    // Check if user has admin access
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.hasAdminAccess = user.role === Role.ADMIN;
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }
} 