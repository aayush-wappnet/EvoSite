import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Material } from '../../../core/models/material.model';
import { Vendor } from '../../../core/models/vendor.model';
import { VendorService } from '../../../core/services/vendor.service';
import { MaterialService } from '../../../core/services/material.service';

@Component({
  selector: 'app-material-order',
  templateUrl: './material-order.component.html',
  styleUrls: ['./material-order.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class MaterialOrderComponent implements OnInit {
  @Input() material!: Material;
  @Output() close = new EventEmitter<void>();
  @Output() orderSuccess = new EventEmitter<void>();

  orderForm: FormGroup;
  vendors: Vendor[] = [];
  loading = false;
  error = '';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private materialService: MaterialService
  ) {
    this.orderForm = this.fb.group({
      vendorId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadVendors();
  }

  closeDialog(): void {
    this.close.emit();
  }

  loadVendors(): void {
    this.loading = true;
    this.vendorService.getAllVendors().subscribe({
      next: (vendors: Vendor[]) => {
        this.vendors = vendors;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Failed to load vendors';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.orderForm.invalid) {
      return;
    }

    this.loading = true;
    const orderData = {
      vendorId: this.orderForm.value.vendorId
    };

    this.materialService.orderMaterial(this.material.id, orderData).subscribe({
      next: () => {
        this.loading = false;
        this.orderSuccess.emit();
        this.closeDialog();
      },
      error: (err: Error) => {
        this.error = 'Failed to place order';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get f() {
    return this.orderForm.controls;
  }
} 