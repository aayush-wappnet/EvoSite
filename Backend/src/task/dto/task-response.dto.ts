import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../common/enums/task-status.enum';

class UserBasicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty()
  progress: number;

  @ApiProperty()
  siteId: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [UserBasicDto], required: false })
  users?: UserBasicDto[];
}