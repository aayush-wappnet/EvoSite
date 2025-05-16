import { ApiProperty } from '@nestjs/swagger';

export class TaskDependencyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  taskId: string;

  @ApiProperty()
  dependentTaskId: string;

  @ApiProperty()
  createdAt: Date;
}