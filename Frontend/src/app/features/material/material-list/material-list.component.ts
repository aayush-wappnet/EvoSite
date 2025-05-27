import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../../../core/services/material.service';
import { SiteService } from '../../../core/services/site.service';
import { Material } from '../../../core/models/material.model';
import { Site } from '../../../core/models/site.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MaterialListComponent implements OnInit {
  materials: Material[] = [];
  sites: Map<string, string> = new Map(); // Map to store site id to name mapping
  displayedColumns: string[] = ['name', 'quantity', 'unit', 'vendor', 'site', 'actions'];
  showDeleteDialog = false;
  materialToDelete: Material | null = null;

  constructor(
    private materialService: MaterialService,
    private siteService: SiteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSites();
    this.loadMaterials();
  }

  loadSites(): void {
    this.siteService.getSites().subscribe({
      next: (sites: Site[]) => {
        sites.forEach(site => {
          this.sites.set(site.id, site.name);
        });
      },
      error: (error: Error) => {
        console.error('Error loading sites:', error);
      }
    });
  }

  loadMaterials(): void {
    this.materialService.findAll().subscribe({
      next: (data) => {
        this.materials = data;
      },
      error: (error) => {
        console.error('Error loading materials:', error);
      }
    });
  }

  onEdit(id: string): void {
    this.router.navigate(['/materials/edit', id]);
  }

  onDelete(material: Material): void {
    this.materialToDelete = material;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.materialToDelete) {
      this.materialService.remove(this.materialToDelete.id).subscribe({
        next: () => {
          this.loadMaterials();
          this.closeDeleteDialog();
        },
        error: (error) => {
          console.error('Error deleting material:', error);
        }
      });
    }
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.materialToDelete = null;
  }

  onCreate(): void {
    this.router.navigate(['/materials/create']);
  }

  getSiteName(siteId: string): string {
    return this.sites.get(siteId) || 'Unknown Site';
  }
} 