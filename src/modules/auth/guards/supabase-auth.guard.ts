import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Falta el header Authorization');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token no proporcionado');

    // 🔹 Verificar sesión con Supabase
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    // 🔹 Buscar en tabla users su información adicional (rol, datos perfil)
    const { data: userInfo } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    // 🔹 Adjuntar usuario completo al request
    request.user = {
      id: user.id,
      email: user.email,
      role: userInfo?.role ?? 'user', // por defecto "user"
      full_name: userInfo?.full_name,
      phone: userInfo?.phone,
    };

    return true;
  }
}
