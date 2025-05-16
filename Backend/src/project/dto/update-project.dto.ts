import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ProjectStatus } from '../../common/enums/project-status.enum';

export class UpdateProjectDto {
  @ApiProperty({ example: 'Commercial Building Project', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Construction of a 5-story commercial building', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2023-01-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.ACTIVE, required: false })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}