import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Fabián González', required: false })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({ example: '+573208635546', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'https://cdn.example.com/avatar.png', required: false })
  @IsOptional()
  @IsString()
  avatar_url?: string;
}
