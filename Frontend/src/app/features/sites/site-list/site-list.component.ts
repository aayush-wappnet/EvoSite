import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Site } from '../../../core/models/site.model';
import { SiteService } from '../../../core/services/site.service';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models';

interface SiteWithProject extends Site {
  project?: Project;
}

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SiteListComponent implements OnInit {
  sites: SiteWithProject[] = [];
  loading = false;
  error: string | null = null;
  showDeleteDialog = false;
  siteToDelete: Site | null = null;

  constructor(
    private siteService: SiteService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSites();
  }

  loadSites(): void {
    this.loading = true;
    this.siteService.getSites().subscribe({
      next: (sites) => {
        this.sites = sites;
        // Load project details for each site
        this.sites.forEach(site => {
          if (site.projectId) {
            this.projectService.getProjectById(site.projectId).subscribe({
              next: (project) => {
                site.project = project;
              },
              error: (error) => {
                console.error(`Error loading project for site ${site.id}:`, error);
              }
            });
          }
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load sites';
        this.loading = false;
        console.error('Error loading sites:', error);
      }
    });
  }

  onCreateSite(): void {
    this.router.navigate(['/sites/create']);
  }

  onEditSite(site: Site): void {
    this.router.navigate(['/sites/edit', site.id]);
  }

  onDeleteSite(site: Site): void {
    this.siteToDelete = site;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.siteToDelete) {
      this.siteService.deleteSite(this.siteToDelete.id).subscribe({
        next: () => {
          this.sites = this.sites.filter(s => s.id !== this.siteToDelete?.id);
          this.closeDeleteDialog();
        },
        error: (error) => {
          this.error = 'Failed to delete site';
          console.error('Error deleting site:', error);
          this.closeDeleteDialog();
        }
      });
    }
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.siteToDelete = null;
  }
} 