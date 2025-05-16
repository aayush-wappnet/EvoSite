import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('task_dependencies')
export class TaskDependency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @Column()
  dependentTaskId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Task, task => task.dependencies)
  task: Task;
}