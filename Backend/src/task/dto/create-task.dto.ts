import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsString, IsUUID, Max, Min } from 'class-validator';
import { TaskStatus } from '../../common/enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Foundation Work' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Laying the foundation for the building' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: '2023-01-15' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2023-02-15' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.PENDING })
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({ example: 0, minimum: 0, maximum: 100 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  progress: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  siteId: string;
}