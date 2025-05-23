import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../../core/services/vendor.service';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/constants/role.enum';

@Component({
  selector: 'app-vendor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.scss']
})
export class VendorFormComponent implements OnInit {
  vendorForm: FormGroup;
  isEditMode = false;
  vendorId: string | null = null;
  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.vendorForm = this.fb.group({
      name: ['', Validators.required],
      contactName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole(Role.ADMIN);
    this.vendorId = this.route.snapshot.paramMap.get('id');
    if (this.vendorId) {
      this.isEditMode = true;
      this.loadVendor(this.vendorId);
    }
  }

  loadVendor(id: string): void {
    this.vendorService.getVendorById(id).subscribe({
      next: (vendor) => {
        this.vendorForm.patchValue(vendor);
      },
      error: (error) => {
        console.error('Error loading vendor:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.vendorForm.valid) {
      const vendorData = this.vendorForm.value;
      if (this.isEditMode && this.vendorId) {
        this.vendorService.updateVendor(this.vendorId, vendorData).subscribe({
          next: () => {
            this.navigateToVendorList();
          },
          error: (error) => {
            console.error('Error updating vendor:', error);
          }
        });
      } else {
        this.vendorService.createVendor(vendorData).subscribe({
          next: () => {
            this.navigateToVendorList();
          },
          error: (error) => {
            console.error('Error creating vendor:', error);
          }
        });
      }
    }
  }

  navigateToVendorList(): void {
    this.router.navigate(['/vendors']);
  }
} 