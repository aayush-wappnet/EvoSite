import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProjectStatus } from '../../common/enums/project-status.enum';
import { User } from '../../user/entities/user.entity';
import { Site } from '../../site/entities/site.entity';
import { Task } from '../../task/entities/task.entity';
import { Document } from '../../document/entities/document.entity';
import { Invoice } from '../../invoice/entities/invoice.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => User, user => user.projects)
  users: User[];

  @OneToMany(() => Site, site => site.project)
  sites: Site[];

  @OneToMany(() => Task, task => task.project)
  tasks: Task[];

  @OneToMany(() => Document, document => document.project)
  documents: Document[];

  @OneToMany(() => Invoice, invoice => invoice.project)
  invoices: Invoice[];
}