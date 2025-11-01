import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { SupabaseClientProvider } from '../../config/supabase.client';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, SupabaseClientProvider],
})
export class NotificationsModule {}
