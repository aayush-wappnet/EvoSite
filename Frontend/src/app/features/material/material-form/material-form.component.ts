import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../../../core/services/material.service';
import { VendorService } from '../../../core/services/vendor.service';
import { SiteService } from '../../../core/services/site.service';
import { Vendor } from '../../../core/models/vendor.model';
import { Site } from '../../../core/models/site.model';

@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class MaterialFormComponent implements OnInit {
  materialForm: FormGroup;
  isEditMode = false;
  materialId: string | null = null;
  vendors: Vendor[] = [];
  sites: Site[] = [];
  currentMaterial: any = null;
  sitesMap: Map<string, string> = new Map();

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private vendorService: VendorService,
    private siteService: SiteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.materialForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      vendorId: ['', Validators.required],
      siteId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadVendors();
    this.loadSites();
    
    this.materialId = this.route.snapshot.paramMap.get('id');
    if (this.materialId) {
      this.isEditMode = true;
      this.loadMaterial();
    }
  }

  loadVendors(): void {
    this.vendorService.getAllVendors().subscribe({
      next: (data: Vendor[]) => {
        this.vendors = data;
      },
      error: (error: Error) => {
        console.error('Error loading vendors:', error);
      }
    });
  }

  loadSites(): void {
    this.siteService.getSites().subscribe({
      next: (data: Site[]) => {
        this.sites = data;
        // Create a map of site IDs to names for quick lookup
        data.forEach(site => {
          this.sitesMap.set(site.id, site.name);
        });
      },
      error: (error: Error) => {
        console.error('Error loading sites:', error);
      }
    });
  }

  getSiteName(siteId: string): string {
    return this.sitesMap.get(siteId) || 'Unknown Site';
  }

  loadMaterial(): void {
    if (this.materialId) {
      this.materialService.findOne(this.materialId).subscribe({
        next: (material) => {
          this.currentMaterial = material;
          // Set all values in the form
          this.materialForm.patchValue({
            name: material.name,
            quantity: material.quantity,
            unit: material.unit,
            vendorId: material.vendor.id,
            siteId: material.siteId
          });

          if (this.isEditMode) {
            // In edit mode, disable all fields except quantity
            this.materialForm.get('name')?.disable();
            this.materialForm.get('unit')?.disable();
            this.materialForm.get('vendorId')?.disable();
            this.materialForm.get('siteId')?.disable();
          }
        },
        error: (error: Error) => {
          console.error('Error loading material:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.materialForm.valid) {
      if (this.isEditMode && this.materialId) {
        // In edit mode, only send quantity
        const updateData = {
          quantity: this.materialForm.get('quantity')?.value
        };
        this.materialService.update(this.materialId, updateData).subscribe({
          next: () => {
            this.router.navigate(['/materials']);
          },
          error: (error: Error) => {
            console.error('Error updating material:', error);
          }
        });
      } else {
        this.materialService.create(this.materialForm.value).subscribe({
          next: () => {
            this.router.navigate(['/materials']);
          },
          error: (error: Error) => {
            console.error('Error creating material:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/materials']);
  }
} 