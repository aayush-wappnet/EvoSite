export enum MaterialStatus {
    REQUESTED = 'REQUESTED',   // Site Engineer requests materials
    APPROVED = 'APPROVED',     // Contractor/Admin approves the request
    ORDERED = 'ORDERED',       // Materials ordered from vendor
    DELIVERED = 'DELIVERED',   // Materials delivered to site
    REJECTED = 'REJECTED',     // Request was denied
  }