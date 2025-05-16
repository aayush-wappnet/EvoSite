import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class AuthResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  token: string;
}