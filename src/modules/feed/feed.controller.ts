import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@ApiTags('feed')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  /** 📌 Crear publicación */
  @Post('posts')
  @ApiResponse({ status: 201, description: 'Publicación creada exitosamente' })
  async createPost(@Request() req, @Body() dto: CreatePostDto) {
    return this.feedService.createPost(req.user.id, dto);
  }

  /** 📌 Listar publicaciones */
  @Get('posts')
  @ApiResponse({ status: 200, description: 'Lista de publicaciones' })
  async getPosts(@Request() req) {
    return this.feedService.findAll();
  }

  /** 📌 Actualizar publicación */
  @Patch('posts/:id')
  @ApiResponse({ status: 200, description: 'Publicación actualizada' })
  async updatePost(
    @Request() req,
    @Param('id') postId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.feedService.updatePost(postId, req.user.id, dto);
  }

  /** 📌 Eliminar publicación */
  @Delete('posts/:id')
  @ApiResponse({ status: 200, description: 'Publicación eliminada' })
  async deletePost(@Request() req, @Param('id') postId: string) {
    return this.feedService.deletePost(postId, req.user.id, req.user.role);
  }

  /** 💬 Crear comentario */
  @Post('comments')
  @ApiResponse({ status: 201, description: 'Comentario creado' })
  async createComment(@Request() req, @Body() dto: CreateCommentDto) {
    return this.feedService.createComment(req.user.id, dto);
  }

  /** 💬 Listar comentarios de una publicación */
  @Get('comments/:postId')
  @ApiResponse({ status: 200, description: 'Comentarios de la publicación' })
  async getComments(@Param('postId') postId: string) {
    return this.feedService.findComments(postId);
  }
}
