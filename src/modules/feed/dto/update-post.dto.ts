import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'Actualicé mi rutina de ejercicios', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: 'https://cdn.mypelvic.com/images/new.png', required: false })
  @IsOptional()
  @IsString()
  image_url?: string;
}
