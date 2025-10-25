// 🚀 main.ts
// Este es el punto de entrada principal del backend.
// - Carga las variables de entorno (.env)
// - Crea la aplicación NestJS usando AppModule
// - Habilita CORS (permite conexión desde el frontend)
// - Escucha peticiones HTTP en el puerto definido
// Es el archivo que realmente "enciende" todo el servidor.

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const config = new DocumentBuilder()
    .setTitle('MyPelvic API')
    .setDescription('Backend MyPelvic (NestJS + Supabase)')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 MyPelvic API: http://localhost:${port} | Docs: /docs`);
}
bootstrap();
