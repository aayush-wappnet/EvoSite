import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { InvoiceStatus } from '../../common/enums/invoice-status.enum';
import { User } from '../../user/entities/user.entity';
import { Project } from '../../project/entities/project.entity';
import { Task } from '../../task/entities/task.entity';
import { InvoiceItem } from './invoice-item.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;

  @Column()
  contractorId: string;

  @Column()
  projectId: string;

  @Column({ nullable: true })
  taskId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.invoices)
  contractor: User;

  @ManyToOne(() => Project, project => project.invoices)
  project: Project;

  @ManyToOne(() => Task, task => task.invoices, { nullable: true })
  task: Task;

  @OneToMany(() => InvoiceItem, invoiceItem => invoiceItem.invoice, { cascade: true })
  items: InvoiceItem[];

  @OneToMany(() => Payment, payment => payment.invoice)
  payments: Payment[];
}