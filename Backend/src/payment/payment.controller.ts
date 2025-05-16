import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { InvoiceService } from '../invoice/invoice.service';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly invoiceService: InvoiceService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully', type: PaymentResponseDto })
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.CONTRACTOR)
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Return all payments', type: [PaymentResponseDto] })
  async findAll(@Request() req): Promise<PaymentResponseDto[]> {
    const payments = await this.paymentService.findAll();
    
    // Filter payments for contractors to only see their own
    if (req.user.role === Role.CONTRACTOR) {
      const contractorInvoices = await this.invoiceService.findAll();
      const contractorInvoiceIds = contractorInvoices
        .filter(invoice => invoice.contractorId === req.user.id)
        .map(invoice => invoice.id);
      
      return payments.filter(payment => contractorInvoiceIds.includes(payment.invoiceId));
    }
    
    return payments;
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CONTRACTOR)
  @ApiOperation({ summary: 'Get a payment by ID' })
  @ApiResponse({ status: 200, description: 'Return the payment', type: PaymentResponseDto })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async findOne(@Param('id') id: string, @Request() req): Promise<PaymentResponseDto> {
    const payment = await this.paymentService.findOne(id);
    
    // Check if contractor is trying to access payment for their invoice
    if (req.user.role === Role.CONTRACTOR) {
      const invoice = await this.invoiceService.findOne(payment.invoiceId);
      if (invoice.contractorId !== req.user.id) {
        throw new Error('Unauthorized');
      }
    }
    
    return payment;
  }
}