import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

dotenv.config();

@Injectable()
export class FeedService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  /** 🟢 Crear publicación */
  async createPost(userId: string, dto: CreatePostDto) {
    const { data, error } = await this.supabase
      .from('posts')
      .insert({ user_id: userId, ...dto })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /** 🟢 Listar publicaciones (todas o por usuario) */
async findAll(userId?: string) {
  // 🧠 Traer publicaciones sin intentar unir con la tabla users
  const query = this.supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (userId) query.eq('user_id', userId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

  /** 🟢 Actualizar publicación (solo autor) */
  async updatePost(postId: string, userId: string, dto: UpdatePostDto) {
    // Verificar propiedad
    const { data: post, error: findErr } = await this.supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single();

    if (findErr || !post) throw new NotFoundException('Post not found');
    if (post.user_id !== userId) throw new ForbiddenException('You cannot edit this post');

    const { data, error } = await this.supabase
      .from('posts')
      .update(dto)
      .eq('id', postId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /** 🟢 Eliminar publicación (autor o admin) */
  async deletePost(postId: string, userId: string, role: string) {
    const { data: post, error: findErr } = await this.supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single();

    if (findErr || !post) throw new NotFoundException('Post not found');
    if (post.user_id !== userId && role !== 'admin') {
      throw new ForbiddenException('You cannot delete this post');
    }

    const { error } = await this.supabase.from('posts').delete().eq('id', postId);
    if (error) throw new Error(error.message);
    return { message: 'Post deleted successfully' };
  }

  /** 💬 Crear comentario */
  async createComment(userId: string, dto: CreateCommentDto) {
    const { data, error } = await this.supabase
      .from('comments')
      .insert({ user_id: userId, ...dto })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

    /** 💬 Listar comentarios de una publicación */
    async findComments(postId: string) {
    // 1️⃣ Obtener todos los comentarios del post
    const { data: comments, error } = await this.supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    if (!comments || comments.length === 0) return [];

    // 2️⃣ Traer datos básicos de usuario para cada comentario (opcional)
    const userIds = comments.map((c) => c.user_id);

    const { data: userData } = await this.supabase
        .from('users')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

    // 3️⃣ Combinar comentarios con datos de usuario
    const merged = comments.map((c) => ({
        ...c,
        user: userData?.find((u) => u.id === c.user_id) || null,
    }));

    return merged;
    }

  /** 💖 Reaccionar a una publicación (like / love / etc.) */
  async reactToPost(userId: string, dto: CreateReactionDto) {
    // Verificar si ya existe reacción igual
    const { data: existing, error: findErr } = await this.supabase
      .from('reactions')
      .select('id')
      .eq('post_id', dto.post_id)
      .eq('user_id', userId)
      .eq('reaction_type', dto.reaction_type)
      .maybeSingle();

    if (findErr) throw new Error(findErr.message);

    if (existing) {
      // Si ya existe, eliminar (toggle like)
      const { error: delErr } = await this.supabase
        .from('reactions')
        .delete()
        .eq('id', existing.id);
      if (delErr) throw new Error(delErr.message);
      return { message: 'Reaction removed successfully' };
    }

    // Si no existe, crear
    const { data, error } = await this.supabase
      .from('reactions')
      .insert({ user_id: userId, ...dto })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { message: 'Reaction added successfully', data };
  }

  /** ❤️ Obtener todas las reacciones de un post */
  async getReactions(postId: string) {
    const { data, error } = await this.supabase
      .from('reactions')
      .select('user_id, reaction_type, created_at')
      .eq('post_id', postId);

    if (error) throw new Error(error.message);
    return data;
  }

  /** 🔢 Contar total de likes por post */
  async getReactionCount(postId: string) {
    const { count, error } = await this.supabase
      .from('reactions')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('reaction_type', 'like');

    if (error) throw new Error(error.message);
    return { post_id: postId, likes: count ?? 0 };
  }

}
