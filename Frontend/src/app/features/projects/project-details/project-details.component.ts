import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user.service';
import { Project, User } from '../../../core/models';
import { Role } from '../../../core/constants';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: Project | null = null;
  loading = true;
  error: string | null = null;
  
  // User assignment properties
  showAssignModal = false;
  availableUsers: User[] = [];
  selectedRole: Role | null = null;
  loadingUsers = false;
  hasAdminAccess = false;
  
  // Confirmation dialog properties
  showConfirmDialog = false;
  userToRemove: User | null = null;
  
  // Make Role enum available in template
  Role = Role;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService
  ) {
    // Check if user has admin access
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.hasAdminAccess = user.role === Role.ADMIN;
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProjectDetails(projectId);
    }
  }

  loadProjectDetails(id: string): void {
    this.loading = true;
    this.error = null;

    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading project details:', error);
        this.error = 'Failed to load project details';
        this.loading = false;
      }
    });
  }

  openAssignModal(role: Role): void {
    this.selectedRole = role;
    this.showAssignModal = true;
    this.loadAvailableUsers(role);
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedRole = null;
    this.availableUsers = [];
  }

  loadAvailableUsers(role: Role): void {
    this.loadingUsers = true;
    let userObservable;

    switch (role) {
      case Role.CONTRACTOR:
        userObservable = this.userService.getContractors();
        break;
      case Role.CLIENT:
        userObservable = this.userService.getClients();
        break;
      case Role.SITE_ENGINEER:
        userObservable = this.userService.getSiteEngineers();
        break;
      default:
        return;
    }

    userObservable.subscribe({
      next: (users) => {
        // Filter out users that are already assigned to the project
        this.availableUsers = users.filter(user => 
          !this.project?.users?.some(projectUser => projectUser.id === user.id)
        );
        this.loadingUsers = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loadingUsers = false;
      }
    });
  }

  assignUser(userId: string): void {
    if (!this.project) return;

    this.projectService.assignUserToProject(this.project.id, userId).subscribe({
      next: (updatedProject) => {
        this.project = updatedProject;
        this.closeAssignModal();
      },
      error: (error) => {
        console.error('Error assigning user:', error);
      }
    });
  }

  confirmRemoveUser(user: User): void {
    this.userToRemove = user;
    this.showConfirmDialog = true;
  }

  cancelRemoveUser(): void {
    this.showConfirmDialog = false;
    this.userToRemove = null;
  }

  removeUser(): void {
    if (!this.project || !this.userToRemove) return;

    this.projectService.removeUserFromProject(this.project.id, this.userToRemove.id).subscribe({
      next: (updatedProject) => {
        this.project = updatedProject;
        this.showConfirmDialog = false;
        this.userToRemove = null;
      },
      error: (error) => {
        console.error('Error removing user:', error);
      }
    });
  }
} 