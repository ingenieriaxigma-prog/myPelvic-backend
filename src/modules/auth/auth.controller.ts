// 🧭 AuthController
// Este controlador recibe las solicitudes HTTP relacionadas con la autenticación.
// - POST /auth/signup → crea un nuevo usuario en Supabase
// - POST /auth/login → inicia sesión
// Valida los datos usando los DTOs y delega la lógica al AuthService.

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
