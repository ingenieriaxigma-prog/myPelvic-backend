import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { UpdateUserDto } from './dto/update-user.dto';

dotenv.config();

@Injectable()
export class UserService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  // Obtener todos los usuarios (solo admin)
  async findAll(role: string) {
    if (role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }
    const { data, error } = await this.supabase.from('users').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  // Obtener perfil de usuario autenticado
  async findOneById(id: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('User not found');
    return data;
  }

  // Actualizar datos básicos
  async update(id: string, updateDto: UpdateUserDto) {
    const { data, error } = await this.supabase
      .from('users')
      .update(updateDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Eliminar usuario
  async remove(id: string) {
    const { error } = await this.supabase.from('users').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { message: 'User deleted successfully' };
  }
}
