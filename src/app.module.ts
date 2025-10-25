// 🏗️ AppModule
// Módulo raíz de la aplicación MyPelvic.
// Se encarga de unir todos los módulos del proyecto.
// Actualmente importa:
// - AuthModule (módulo de autenticación)
// También define el controlador y servicio base de la aplicación.

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
