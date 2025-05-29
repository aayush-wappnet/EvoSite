import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Material } from '../../material/entities/material.entity';

@Entity('invoice_items')
export class InvoiceItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  invoiceId: string;

  @Column()
  materialId: string;

  @Column({ type: 'float' })
  quantity: number;

  @Column({ type: 'float' })
  unitPrice: number;

  @Column({ type: 'float' })
  total: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Invoice, invoice => invoice.items)
  invoice: Invoice;

  @ManyToOne(() => Material, material => material.invoiceItems)
  material: Material;
}