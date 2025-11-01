// 🏗️ AppModule
// Módulo raíz de la aplicación MyPelvic.
// Se encarga de unir todos los módulos del proyecto.
// Actualmente importa:
// - AuthModule (módulo de autenticación)
// - UserModule (módulo de gestión de usuarios)
// - ConfigModule (para leer las variables de entorno)
// También define el controlador y servicio base de la aplicación.

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  // 👈 Carga variables de entorno (.env)
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';  // 👈 NUEVO módulo agregado
import { FeedModule } from './modules/feed/feed.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
@Module({
  imports: [
    // 🌍 Permite usar variables de entorno (.env) en toda la app
    ConfigModule.forRoot({
      isGlobal: true, // disponible en todos los módulos
    }),

    // 🚦 Limita a 100 peticiones por minuto por IP
    ThrottlerModule.forRoot([{
      ttl: 60,   // tiempo de ventana en segundos
      limit: 100 // máximo de peticiones por IP
    }]),

    // 🔐 Módulo de autenticación (registro, login, protección con guardias)
    AuthModule,

    // 👥 Módulo de usuarios (perfil, actualización y eliminación)
    UserModule,
    // 👥 Módulo de feed (ppublicaciones, comentarios, etc)
    FeedModule,
    // 👥 Módulo de notificaciones
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
