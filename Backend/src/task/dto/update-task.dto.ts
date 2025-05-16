import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { TaskStatus } from '../../common/enums/task-status.enum';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Foundation Work', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Laying the foundation for the building', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS, required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ example: 50, minimum: 0, maximum: 100, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;
}