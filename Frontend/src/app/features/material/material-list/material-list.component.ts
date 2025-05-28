import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../../../core/services/material.service';
import { AuthService } from '../../../core/services/auth.service';
import { Material } from '../../../core/models/material.model';
import { Role } from '../../../core/constants/role.enum';
import { MaterialStatus } from '../../../core/constants/material-status.enum';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialOrderComponent } from '../material-order/material-order.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialOrderComponent, ConfirmationDialogComponent]
})
export class MaterialListComponent implements OnInit {
  materials: Material[] = [];
  loading = false;
  error = '';
  readonly MaterialStatus = MaterialStatus;
  readonly Role = Role;
  showOrderDialog = false;
  selectedMaterial: Material | null = null;
  showConfirmDialog = false;
  confirmDialogConfig = {
    title: '',
    message: '',
    type: 'warning' as 'warning' | 'danger',
    confirmText: '',
    onConfirm: () => {}
  };

  constructor(
    private materialService: MaterialService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  hasRole(role: Role): boolean {
    return this.authService.hasRole(role);
  }

  loadMaterials(): void {
    this.loading = true;
    this.materialService.getAllMaterial().subscribe({
      next: (data: Material[]) => {
        this.materials = data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Failed to load materials';
        this.loading = false;
        console.error(err);
      }
    });
  }

  openOrderDialog(material: Material): void {
    this.selectedMaterial = material;
    this.showOrderDialog = true;
  }

  closeOrderDialog(): void {
    this.showOrderDialog = false;
    this.selectedMaterial = null;
  }

  onOrderSuccess(): void {
    this.loadMaterials();
  }

  openConfirmDialog(config: {
    title: string;
    message: string;
    type: 'warning' | 'danger';
    confirmText: string;
    onConfirm: () => void;
  }): void {
    this.confirmDialogConfig = config;
    this.showConfirmDialog = true;
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
  }

  onConfirmAction(): void {
    this.confirmDialogConfig.onConfirm();
    this.closeConfirmDialog();
  }

  deliverMaterial(id: string): void {
    this.openConfirmDialog({
      title: 'Confirm Delivery',
      message: 'Are you sure you want to mark this material as delivered?',
      type: 'warning',
      confirmText: 'Mark Delivered',
      onConfirm: () => {
        this.loading = true;
        this.materialService.deliverMaterial(id).subscribe({
          next: () => {
            this.loadMaterials();
          },
          error: (err: Error) => {
            this.error = 'Failed to mark as delivered';
            this.loading = false;
            console.error(err);
          }
        });
      }
    });
  }

  cancelRequest(id: string): void {
    this.openConfirmDialog({
      title: 'Cancel Request',
      message: 'Are you sure you want to cancel this material request? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Cancel Request',
      onConfirm: () => {
        this.loading = true;
        this.materialService.remove(id).subscribe({
          next: () => {
            this.loadMaterials();
          },
          error: (err: Error) => {
            this.error = 'Failed to cancel request';
            this.loading = false;
            console.error(err);
          }
        });
      }
    });
  }

  approveRequest(id: string): void {
    this.loading = true;
    this.materialService.approveRequest(id).subscribe({
      next: () => {
        this.loadMaterials();
      },
      error: (err: Error) => {
        this.error = 'Failed to approve request';
        this.loading = false;
        console.error(err);
      }
    });
  }

  rejectRequest(id: string): void {
    this.loading = true;
    this.materialService.rejectRequest(id).subscribe({
      next: () => {
        this.loadMaterials();
      },
      error: (err: Error) => {
        this.error = 'Failed to reject request';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getStatusClass(status: MaterialStatus): string {
    const statusClasses = {
      [MaterialStatus.REQUESTED]: 'bg-yellow-100 text-yellow-800',
      [MaterialStatus.APPROVED]: 'bg-blue-100 text-blue-800',
      [MaterialStatus.ORDERED]: 'bg-purple-100 text-purple-800',
      [MaterialStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [MaterialStatus.REJECTED]: 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  canApprove(status: MaterialStatus): boolean {
    return status === MaterialStatus.REQUESTED;
  }

  canOrder(status: MaterialStatus): boolean {
    return status === MaterialStatus.APPROVED;
  }

  canDeliver(status: MaterialStatus): boolean {
    return status === MaterialStatus.ORDERED;
  }

  canCancel(status: MaterialStatus): boolean {
    return status === MaterialStatus.REQUESTED;
  }
} 