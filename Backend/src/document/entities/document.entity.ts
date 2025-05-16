import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DocumentType } from '../../common/enums/document-type.enum';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../user/entities/user.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  version: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: DocumentType;

  @Column()
  projectId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Project, project => project.documents)
  project: Project;

  @ManyToOne(() => User, user => user.documents)
  user: User;
}