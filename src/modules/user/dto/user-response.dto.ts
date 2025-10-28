import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  full_name?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  avatar_url?: string;

  @ApiProperty({ enum: ['user', 'specialist', 'admin'] })
  role: string;

  @ApiProperty()
  created_at: string;
}
