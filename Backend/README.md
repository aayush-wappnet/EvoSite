# Construction Project & Contractor Management System

A comprehensive backend system for managing construction projects, contractors, tasks, materials, documents, and invoices.

## Tech Stack

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Cloudinary (document storage)
- Swagger

## Features

- Multi-site projects
- Task dependencies
- Material tracking (vendor-linked)
- Document versioning (Cloudinary)
- Invoicing with itemized materials
- Manual payment logging
- JWT-based role access
- Swagger documentation

## Roles

- **Admin**: Full control over all resources
- **Contractor**: Manage tasks, invoices, and documents
- **Site Engineer**: Manage tasks, materials, and documents
- **Client**: View projects, tasks, and documents

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables in `.env` file:
   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=construction_management
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=1d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the application:
   ```
   npm run start:dev
   ```

## API Documentation

Swagger documentation is available at `/api` when the application is running.

## Modules

- **Auth**: User registration and authentication
- **User**: User management
- **Project**: Project management
- **Site**: Site management
- **Task**: Task management with dependencies
- **Material**: Material tracking
- **Vendor**: Vendor management
- **Document**: Document management with Cloudinary integration
- **Invoice**: Invoice management with itemized materials
- **Payment**: Payment tracking

## Database Schema

The system uses the following entities:

- User
- Project
- Site
- Task
- TaskDependency
- Material
- Vendor
- Document
- Invoice
- InvoiceItem
- Payment
