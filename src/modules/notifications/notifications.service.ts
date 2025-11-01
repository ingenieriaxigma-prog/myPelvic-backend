import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { UpdateNotificationDto } from './dto/update-notification.dto';



dotenv.config();

@Injectable()
export class NotificationsService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  /** 📬 Obtener notificaciones del usuario actual */
  async findAll(userId: string) {
  const { data, error } = await this.supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new InternalServerErrorException(error.message);
  return data;
}


  /** 🔔 Marcar notificación como leída */
  async markAsRead(id: string, userId: string, dto: UpdateNotificationDto) {
    // validar que la notificación pertenezca al usuario
    const { data: existing, error: findErr } = await this.supabase
      .from('notifications')
      .select('user_id')
      .eq('id', id)
      .single();

    if (findErr || !existing) throw new NotFoundException('Notification not found');
    if (existing.user_id !== userId)
      throw new NotFoundException('Access denied');

    const { data, error } = await this.supabase
      .from('notifications')
      .update({ read: dto.read })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Supabase Error] =>', error.message);
      throw new InternalServerErrorException('Error al obtener notificaciones');
    }
  }
}
