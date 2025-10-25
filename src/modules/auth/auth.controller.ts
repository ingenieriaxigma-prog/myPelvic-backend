// 🧭 AuthController
// Este controlador recibe las solicitudes HTTP relacionadas con la autenticación.
// - POST /auth/signup → crea un nuevo usuario en Supabase
// - POST /auth/login → inicia sesión
// Valida los datos usando los DTOs y delega la lógica al AuthService.

import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🧩 Registro de usuario
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto.email, dto.password);
  }

  // 🔑 Inicio de sesión
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  // 🧠 Ruta protegida para verificar token
  @UseGuards(SupabaseAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return {
      message: '✅ Token válido',
      user: req.user,
    };
  }
}
