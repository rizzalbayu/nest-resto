import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/common/interception/transform.interceptor';
import { AuthService } from './auth.service';
import { registerDto } from './dto/auth.dto';

@Controller('auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: registerDto) {
    const data = await this.authService.register(body);
    return {
      success: data ? true : false,
      message: null,
      data: null,
    };
  }

  @Post('/login')
  async login(@Body() body: registerDto) {
    const data = await this.authService.login(body);
    return {
      success: data ? true : false,
      message: null,
      data: data,
    };
  }
}
