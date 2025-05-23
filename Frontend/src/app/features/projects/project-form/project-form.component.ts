import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models';
import { ProjectStatus } from '../../../core/constants/project-status.enum';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'project-form.component.html',
  styleUrls: ['project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  projectId: string | null = null;
  projectStatuses = Object.values(ProjectStatus);

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: [ProjectStatus.ACTIVE, Validators.required]
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.projectId;

    if (this.isEditMode && this.projectId) {
      this.loadProject(this.projectId);
    }
  }

  loadProject(id: string): void {
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        // Format dates for the date input
        const formattedProject = {
          ...project,
          startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
          endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''
        };
        this.projectForm.patchValue(formattedProject);
      },
      error: (error) => {
        console.error('Error loading project:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;

      if (this.isEditMode && this.projectId) {
        this.projectService.updateProject(this.projectId, projectData).subscribe({
          next: () => {
            this.router.navigate(['/projects']);
          },
          error: (error) => {
            console.error('Error updating project:', error);
          }
        });
      } else {
        this.projectService.createProject(projectData).subscribe({
          next: () => {
            this.router.navigate(['/projects']);
          },
          error: (error) => {
            console.error('Error creating project:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/projects']);
  }
} 