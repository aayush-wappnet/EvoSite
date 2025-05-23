import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VendorService } from '../../../core/services/vendor.service';
import { Vendor } from '../../../core/models/vendor.model';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/constants/role.enum';

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {
  vendors: Vendor[] = [];
  hasAdminAccess = false;
  showDeleteDialog = false;
  vendorToDelete: Vendor | null = null;

  constructor(
    private vendorService: VendorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadVendors();
    this.hasAdminAccess = this.authService.hasRole(Role.ADMIN);
  }

  loadVendors(): void {
    this.vendorService.getAllVendors().subscribe({
      next: (vendors) => {
        this.vendors = vendors;
      },
      error: (error) => {
        console.error('Error loading vendors:', error);
      }
    });
  }

  confirmDelete(vendor: Vendor): void {
    this.vendorToDelete = vendor;
    this.showDeleteDialog = true;
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.vendorToDelete = null;
  }

  deleteVendor(): void {
    if (this.vendorToDelete) {
      this.vendorService.deleteVendor(this.vendorToDelete.id).subscribe({
        next: () => {
          this.vendors = this.vendors.filter(vendor => vendor.id !== this.vendorToDelete?.id);
          this.cancelDelete();
        },
        error: (error) => {
          console.error('Error deleting vendor:', error);
        }
      });
    }
  }
} 