import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProjectStatus } from '../../common/enums/project-status.enum';

export class CreateProjectDto {
  @ApiProperty({ example: 'Commercial Building Project' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Construction of a 5-story commercial building' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: '2023-01-01' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.ACTIVE })
  @IsNotEmpty()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}