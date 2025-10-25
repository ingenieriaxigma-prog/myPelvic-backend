// 🧩 AuthModule
// Este módulo agrupa toda la funcionalidad relacionada con la autenticación.
// Registra:
// - AuthController (maneja las rutas HTTP)
// - AuthService (lógica de registro/login)
// - SupabaseClientProvider (conexión a Supabase)
// Así NestJS sabe cómo ensamblar y usar los componentes del módulo "auth".

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseClientProvider } from '../../config/supabase.client';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SupabaseClientProvider],
})
export class AuthModule {}
