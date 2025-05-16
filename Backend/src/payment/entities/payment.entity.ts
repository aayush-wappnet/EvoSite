import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { Invoice } from '../../invoice/entities/invoice.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  invoiceId: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.COMPLETED,
  })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Invoice, invoice => invoice.payments)
  invoice: Invoice;
}