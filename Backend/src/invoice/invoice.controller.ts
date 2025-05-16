import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @Roles(Role.CONTRACTOR)
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully', type: InvoiceResponseDto })
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Request() req,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.create(createInvoiceDto, req.user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.CONTRACTOR)
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({ status: 200, description: 'Return all invoices', type: [InvoiceResponseDto] })
  async findAll(@Request() req): Promise<InvoiceResponseDto[]> {
    const invoices = await this.invoiceService.findAll();
    
    // Filter invoices for contractors to only see their own
    if (req.user.role === Role.CONTRACTOR) {
      return invoices.filter(invoice => invoice.contractorId === req.user.id);
    }
    
    return invoices;
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CONTRACTOR)
  @ApiOperation({ summary: 'Get an invoice by ID' })
  @ApiResponse({ status: 200, description: 'Return the invoice', type: InvoiceResponseDto })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async findOne(@Param('id') id: string, @Request() req): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceService.findOne(id);
    
    // Check if contractor is trying to access their own invoice
    if (req.user.role === Role.CONTRACTOR && invoice.contractorId !== req.user.id) {
      throw new Error('Unauthorized');
    }
    
    return invoice;
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update an invoice status' })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully', type: InvoiceResponseDto })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete an invoice' })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.invoiceService.remove(id);
    return { message: 'Invoice deleted successfully' };
  }
}