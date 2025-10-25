import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Seguridad básica
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minuto
      max: 100, // máximo 100 peticiones por IP
    }),
  );

  // ✅ Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // ✅ Configuración de Swagger (ahora con Bearer Token funcionando)
  const config = new DocumentBuilder()
    .setTitle('MyPelvic API')
    .setDescription('Documentación interactiva de la API MyPelvic')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Introduce tu token JWT obtenido desde /auth/login',
        in: 'header',
      },
      'access-token', // 👈 nombre del esquema
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // 🚀 Iniciar servidor
  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 MyPelvic API corriendo en http://localhost:${process.env.PORT || 3000}/docs`);
}
bootstrap();
