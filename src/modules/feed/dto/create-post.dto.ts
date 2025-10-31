import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Hoy aprendí un nuevo ejercicio de piso pélvico' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'https://cdn.mypelvic.com/images/post1.png', required: false })
  @IsOptional()
  @IsString()
  image_url?: string;
}
