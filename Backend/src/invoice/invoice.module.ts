import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';
import { MaterialModule } from '../material/material.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceItem]),
    ProjectModule,
    TaskModule,
    MaterialModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}