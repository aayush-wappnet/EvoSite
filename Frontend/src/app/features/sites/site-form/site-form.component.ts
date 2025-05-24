import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Site, CreateSiteDto, UpdateSiteDto } from '../../../core/models/site.model';
import { SiteService } from '../../../core/services/site.service';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models';

@Component({
  selector: 'app-site-form',
  templateUrl: './site-form.component.html',
  styleUrls: ['./site-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SiteFormComponent implements OnInit {
  siteForm: FormGroup;
  isEditMode = false;
  siteId: string | null = null;
  loading = false;
  error: string | null = null;
  projects: Project[] = [];

  constructor(
    private fb: FormBuilder,
    private siteService: SiteService,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.siteForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', [Validators.required]],
      projectId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
    this.siteId = this.route.snapshot.paramMap.get('id');
    if (this.siteId) {
      this.isEditMode = true;
      this.loadSite();
    }
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        this.error = 'Failed to load projects';
        console.error('Error loading projects:', error);
      }
    });
  }

  loadSite(): void {
    if (!this.siteId) return;
    
    this.loading = true;
    this.siteService.getSite(this.siteId).subscribe({
      next: (site) => {
        this.siteForm.patchValue({
          name: site.name,
          location: site.location,
          projectId: site.projectId
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load site';
        this.loading = false;
        console.error('Error loading site:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.siteForm.invalid) return;

    this.loading = true;
    const formData = this.siteForm.value;
    
    // Remove projectId from update request
    if (this.isEditMode) {
      delete formData.projectId;
    }

    const request = this.isEditMode
      ? this.siteService.updateSite(this.siteId!, formData)
      : this.siteService.createSite(formData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/sites']);
      },
      error: (error) => {
        this.error = `Failed to ${this.isEditMode ? 'update' : 'create'} site`;
        this.loading = false;
        console.error('Error saving site:', error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/sites']);
  }
} 