import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ProjectService } from '../project/project.service';
import { TaskService } from '../task/task.service';
import { MaterialService } from '../material/material.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    private projectService: ProjectService,
    private taskService: TaskService,
    private materialService: MaterialService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, contractorId: string): Promise<Invoice> {
    // Verify project exists
    await this.projectService.findOne(createInvoiceDto.projectId);
    
    // Verify task exists if provided
    if (createInvoiceDto.taskId) {
      await this.taskService.findOne(createInvoiceDto.taskId);
    }
    
    // Calculate total amount and create invoice items
    let totalAmount = 0;
    const invoiceItems = [];
    
    // Process each item
    for (const item of createInvoiceDto.items) {
      const material = await this.materialService.findOne(item.materialId);
      
      if (!material.vendorId) {
        throw new BadRequestException(`Material with ID ${item.materialId} does not have a vendor`);
      }

      // Calculate total for this item using material's quantity
      const itemTotal = material.quantity * item.unitPrice;
      totalAmount += itemTotal;

      // Create invoice item
      const invoiceItem = this.invoiceItemRepository.create({
        materialId: item.materialId,
        quantity: material.quantity,
        unitPrice: item.unitPrice,
        total: itemTotal
      });
      
      invoiceItems.push(invoiceItem);
    }
    
    // Create invoice with calculated amount
    const invoice = this.invoiceRepository.create({
      amount: totalAmount,
      projectId: createInvoiceDto.projectId,
      taskId: createInvoiceDto.taskId,
      contractorId,
    });
    
    // Save invoice to get ID
    const savedInvoice = await this.invoiceRepository.save(invoice);
    
    // Set invoice ID for all items and save them
    invoiceItems.forEach(item => item.invoiceId = savedInvoice.id);
    savedInvoice.items = await this.invoiceItemRepository.save(invoiceItems);
    
    return this.findOne(savedInvoice.id);
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      relations: ['items', 'items.material', 'items.material.vendor', 'contractor', 'project', 'task'],
    });
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['items', 'items.material', 'items.material.vendor', 'contractor', 'project', 'task'],
    });
    
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    
    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);
    Object.assign(invoice, updateInvoiceDto);
    return this.invoiceRepository.save(invoice);
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoiceRepository.remove(invoice);
  }
}