import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsIn } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty({ example: 'f9d40cc5-bf79-44e8-bfa3-2e9b12c1e2f7' })
  @IsUUID()
  post_id: string;

  @ApiProperty({
    example: 'like',
    enum: ['like', 'love', 'support', 'insightful'],
    required: false,
  })
  @IsOptional()
  @IsIn(['like', 'love', 'support', 'insightful'])
  reaction_type?: 'like' | 'love' | 'support' | 'insightful' = 'like';
}
