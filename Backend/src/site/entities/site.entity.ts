import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { Task } from '../../task/entities/task.entity';
import { Material } from '../../material/entities/material.entity';

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  projectId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Project, project => project.sites)
  project: Project;

  @OneToMany(() => Task, task => task.site)
  tasks: Task[];

  @OneToMany(() => Material, material => material.site)
  materials: Material[];
}