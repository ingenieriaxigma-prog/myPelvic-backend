import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SupabaseClientProvider } from '../../config/supabase.client';

@Module({
  controllers: [UserController],
  providers: [UserService, SupabaseClientProvider],
})
export class UserModule {}
