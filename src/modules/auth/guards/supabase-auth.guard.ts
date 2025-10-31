import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // 📌 Aquí asignamos el usuario real al request
    request.user = {
      id: data.user.id,
      email: data.user.email,
      role: await this.getUserRole(data.user.id),
    };

    return true;
  }

  // Función auxiliar: obtener el rol desde la tabla users
  private async getUserRole(userId: string): Promise<string> {
    const { data, error } = await this.supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) return 'user'; // rol por defecto
    return data.role;
  }
}
