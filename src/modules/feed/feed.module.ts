import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { SupabaseClientProvider } from '../../config/supabase.client';

@Module({
  controllers: [FeedController],
  providers: [FeedService, SupabaseClientProvider],
})
export class FeedModule {}
