import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { Site } from '../../site/entities/site.entity';
import { User } from '../../user/entities/user.entity';
import { TaskDependency } from './task-dependency.entity';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { Project } from '../../project/entities/project.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({ type: 'int', default: 0 })
  progress: number;

  @Column()
  siteId: string;

  @Column()
  projectId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Site, site => site.tasks)
  site: Site;

  @ManyToOne(() => Project, project => project.tasks)
  project: Project;

  @ManyToMany(() => User, user => user.tasks)
  users: User[];

  @OneToMany(() => TaskDependency, dependency => dependency.task)
  dependencies: TaskDependency[];

  @OneToMany(() => Invoice, invoice => invoice.task)
  invoices: Invoice[];
}