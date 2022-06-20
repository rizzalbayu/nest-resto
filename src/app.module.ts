import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './menu/menu.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [TypeOrmModule.forRoot({}), MenuModule, UsersModule, AuthModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
