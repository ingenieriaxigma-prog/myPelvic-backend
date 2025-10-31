import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Excelente publicación 💪' })
  @IsString()
  text: string;

  @ApiProperty({ example: 'c35c7a67-ec65-4c19-8790-b23e86b9b42d' })
  @IsUUID()
  post_id: string;
}
