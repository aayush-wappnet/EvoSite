import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Site } from '../../site/entities/site.entity';
import { Vendor } from '../../vendor/entities/vendor.entity';
import { InvoiceItem } from '../../invoice/entities/invoice-item.entity';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { User } from '../../user/entities/user.entity';

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'float' })
  quantity: number;

  @Column()
  unit: string;

  @Column({ nullable: true })
  vendorId: string;

  @Column()
  siteId: string;

  @Column({
    type: 'enum',
    enum: MaterialStatus,
    default: MaterialStatus.REQUESTED
  })
  status: MaterialStatus;

  @Column()
  requestedById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Site, site => site.materials)
  site: Site;

  @ManyToOne(() => Vendor, vendor => vendor.materials)
  vendor: Vendor;

  @ManyToOne(() => User, user => user.materialRequests)
  requestedBy: User;

  @OneToMany(() => InvoiceItem, invoiceItem => invoiceItem.material)
  invoiceItems: InvoiceItem[];
}