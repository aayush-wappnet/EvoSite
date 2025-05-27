import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';
import { TaskService } from '../task/task.service';
import { MaterialService } from '../material/material.service';
import { VendorService } from '../vendor/vendor.service';
import { DocumentService } from '../document/document.service';
import { InvoiceService } from '../invoice/invoice.service';
import { PaymentService } from '../payment/payment.service';
import { Role } from '../common/enums/role.enum';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    private readonly materialService: MaterialService,
    private readonly vendorService: VendorService,
    private readonly documentService: DocumentService,
    private readonly invoiceService: InvoiceService,
    private readonly paymentService: PaymentService,
  ) {}

  async getAdminStats(user: User) {
    const [
      totalUsers,
      totalProjects,
      totalTasks,
      totalMaterials,
      totalVendors,
      totalDocuments,
      totalInvoices,
      totalPayments,
    ] = await Promise.all([
      this.userService.findAll(),
      this.projectService.findAll(user),
      this.taskService.findAll(user),
      this.materialService.findAll(),
      this.vendorService.findAll(),
      this.documentService.findAll(),
      this.invoiceService.findAll(),
      this.paymentService.findAll(),
    ]);

    return {
      totalUsers: totalUsers.length,
      totalProjects: totalProjects.length,
      totalTasks: totalTasks.length,
      totalMaterials: totalMaterials.length,
      totalVendors: totalVendors.length,
      totalDocuments: totalDocuments.length,
      totalInvoices: totalInvoices.length,
      totalPayments: totalPayments.length,
      userDistribution: this.getUserDistribution(totalUsers),
    };
  }

  async getContractorStats(user: User) {
    const [
      projects,
      tasks,
      materials,
      documents,
      invoices,
    ] = await Promise.all([
      this.projectService.findAll(user),
      this.taskService.findAll(user),
      this.materialService.findAll(),
      this.documentService.findAll(),
      this.invoiceService.findAll(),
    ]);

    // Filter invoices for the contractor
    const contractorInvoices = invoices.filter(invoice => invoice.contractorId === user.id);

    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      totalMaterials: materials.length,
      totalDocuments: documents.length,
      totalInvoices: contractorInvoices.length,
      taskStatusDistribution: this.getTaskStatusDistribution(tasks),
      projectStatusDistribution: this.getProjectStatusDistribution(projects),
    };
  }

  async getSiteEngineerStats(user: User) {
    const [
      tasks,
      materials,
      documents,
    ] = await Promise.all([
      this.taskService.findAll(user),
      this.materialService.findAll(),
      this.documentService.findAll(),
    ]);

    return {
      totalTasks: tasks.length,
      totalMaterials: materials.length,
      totalDocuments: documents.length,
      taskStatusDistribution: this.getTaskStatusDistribution(tasks),
    };
  }

  async getClientStats(user: User) {
    const [
      projects,
      documents,
      invoices,
      payments,
    ] = await Promise.all([
      this.projectService.findAll(user),
      this.documentService.findAll(),
      this.invoiceService.findAll(),
      this.paymentService.findAll(),
    ]);

    return {
      totalProjects: projects.length,
      totalDocuments: documents.length,
      totalInvoices: invoices.length,
      totalPayments: payments.length,
      projectStatusDistribution: this.getProjectStatusDistribution(projects),
      paymentStatusDistribution: this.getPaymentStatusDistribution(payments),
    };
  }

  private getUserDistribution(users: User[]) {
    const distribution = {};
    Object.values(Role).forEach(role => {
      distribution[role] = users.filter(user => user.role === role).length;
    });
    return distribution;
  }

  private getTaskStatusDistribution(tasks: any[]) {
    const distribution = {};
    tasks.forEach(task => {
      distribution[task.status] = (distribution[task.status] || 0) + 1;
    });
    return distribution;
  }

  private getProjectStatusDistribution(projects: any[]) {
    const distribution = {};
    projects.forEach(project => {
      distribution[project.status] = (distribution[project.status] || 0) + 1;
    });
    return distribution;
  }

  private getPaymentStatusDistribution(payments: any[]) {
    const distribution = {};
    payments.forEach(payment => {
      distribution[payment.status] = (distribution[payment.status] || 0) + 1;
    });
    return distribution;
  }
} 