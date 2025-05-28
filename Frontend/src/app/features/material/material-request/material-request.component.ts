import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../../../core/services/material.service';
import { SiteService } from '../../../core/services/site.service';
import { AuthService } from '../../../core/services/auth.service';
import { CreateMaterial } from '../../../core/models/material.model';
import { Site } from '../../../core/models/site.model';

@Component({
  selector: 'app-material-request',
  templateUrl: './material-request.component.html',
  styleUrls: ['./material-request.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class MaterialRequestComponent implements OnInit {
  requestForm: FormGroup;
  sites: Site[] = [];
  loading = false;
  error = '';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private siteService: SiteService,
    private authService: AuthService,
    private router: Router
  ) {
    this.requestForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      unit: ['', Validators.required],
      siteId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSites();
  }

  loadSites(): void {
    this.siteService.getSites().subscribe({
      next: (sites: Site[]) => {
        this.sites = sites;
      },
      error: (err: Error) => {
        this.error = 'Failed to load sites';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.requestForm.invalid) {
      return;
    }

    this.loading = true;
    const currentUser = this.authService.getUser();
    
    if (!currentUser) {
      this.error = 'User not authenticated';
      this.loading = false;
      return;
    }

    const materialRequest: CreateMaterial = {
      ...this.requestForm.value,
      requestedById: currentUser.id
    };

    this.materialService.requestMaterial(materialRequest).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/materials']);
      },
      error: (err: Error) => {
        this.error = 'Failed to create material request';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get f() {
    return this.requestForm.controls;
  }
} 