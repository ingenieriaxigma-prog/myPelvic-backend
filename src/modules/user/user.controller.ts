import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiResponse({ status: 200, description: 'Perfil del usuario actual' })
  async getProfile(@Request() req) {
    const userId = req.user?.id;
    return this.userService.findOneById(userId);
  }

  @Patch('me')
  @ApiResponse({ status: 200, description: 'Datos del usuario actual actualizados' })
  async updateProfile(@Request() req, @Body() updateDto: UpdateUserDto) {
    const userId = req.user?.id;
    return this.userService.update(userId, updateDto);
  }

  @Delete('me')
  @ApiResponse({ status: 200, description: 'Cuenta eliminada correctamente' })
  async deleteProfile(@Request() req) {
    const userId = req.user?.id;
    return this.userService.remove(userId);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de usuarios (solo admin)' })
  async getAllUsers(@Request() req) {
    const role = req.user?.role;
    return this.userService.findAll(role);
  }
}
