import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './menu/menu.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot({}), MenuModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
