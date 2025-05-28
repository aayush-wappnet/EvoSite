import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { Project } from '../../project/entities/project.entity';
import { Task } from '../../task/entities/task.entity';
import { Document } from '../../document/entities/document.entity';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { Material } from '../../material/entities/material.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Project, project => project.users)
  @JoinTable({
    name: 'user_projects',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'projectId', referencedColumnName: 'id' },
  })
  projects: Project[];

  @ManyToMany(() => Task, task => task.users)
  @JoinTable({
    name: 'user_tasks',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'taskId', referencedColumnName: 'id' },
  })
  tasks: Task[];

  @OneToMany(() => Document, document => document.user)
  documents: Document[];

  @OneToMany(() => Invoice, invoice => invoice.contractor)
  invoices: Invoice[];

  @OneToMany(() => Material, material => material.requestedBy)
  materialRequests: Material[];
}