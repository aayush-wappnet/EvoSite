import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Site } from '../../site/entities/site.entity';
import { Vendor } from '../../vendor/entities/vendor.entity';
import { InvoiceItem } from '../../invoice/entities/invoice-item.entity';

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

  @Column()
  vendorId: string;

  @Column()
  siteId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Site, site => site.materials)
  site: Site;

  @ManyToOne(() => Vendor, vendor => vendor.materials)
  vendor: Vendor;

  @OneToMany(() => InvoiceItem, invoiceItem => invoiceItem.material)
  invoiceItems: InvoiceItem[];
}