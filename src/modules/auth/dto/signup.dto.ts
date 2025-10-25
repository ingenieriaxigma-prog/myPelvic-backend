// 🧾 SignupDto
// Este DTO define y valida los datos para el registro de usuario.
// Requiere:
// - email válido
// - contraseña de al menos 6 caracteres
// NestJS usa esta clase para validar automáticamente las peticiones antes de procesarlas.

import { IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;
}
