// 🧠 AuthService
// Este servicio maneja toda la lógica de autenticación.
// Usa el cliente de Supabase para registrar y autenticar usuarios.
// No responde directamente al navegador: devuelve resultados al controlador.

import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../config/supabase.client';

@Injectable()
export class AuthService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async signup(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return { message: 'User registered successfully', data };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { message: 'Login successful', data };
  }
}
