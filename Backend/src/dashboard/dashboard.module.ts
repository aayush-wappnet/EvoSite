import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';
import { MaterialModule } from '../material/material.module';
import { VendorModule } from '../vendor/vendor.module';
import { DocumentModule } from '../document/document.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    UserModule,
    ProjectModule,
    TaskModule,
    MaterialModule,
    VendorModule,
    DocumentModule,
    InvoiceModule,
    PaymentModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {} 