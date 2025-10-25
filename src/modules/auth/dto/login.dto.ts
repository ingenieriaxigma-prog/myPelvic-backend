// 🧾 LoginDto
// Define y valida los datos para el inicio de sesión.
// Requiere los mismos campos que el registro (email + contraseña).
// Protege el backend contra datos inválidos antes de llegar al AuthService.

import { IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;
}
