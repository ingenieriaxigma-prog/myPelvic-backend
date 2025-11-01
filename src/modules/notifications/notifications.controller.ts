import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /** 📬 Listar notificaciones del usuario actual */
  @Get()
  @ApiResponse({ status: 200, description: 'Lista de notificaciones del usuario autenticado' })
  async getNotifications(@Request() req) {
    return this.notificationsService.findAll(req.user.id);
  }

  /** ✅ Marcar notificación como leída */
  @Patch(':id/read')
  @ApiResponse({ status: 200, description: 'Notificación marcada como leída' })
  async markAsRead(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.notificationsService.markAsRead(id, req.user.id, dto);
  }
}
