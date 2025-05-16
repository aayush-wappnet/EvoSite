import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../../common/enums/project-status.enum';

class UserBasicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

class SiteBasicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [UserBasicDto], required: false })
  users?: UserBasicDto[];

  @ApiProperty({ type: [SiteBasicDto], required: false })
  sites?: SiteBasicDto[];
}