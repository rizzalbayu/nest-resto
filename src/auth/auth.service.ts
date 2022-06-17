import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { registerDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(body: registerDto) {
    const user = new User();
    user.email = body.username;
    user.fullName = body.fullName;
    user.createdBy = body.username;
    user.updatedBy = body.username;
    user.password = await bcrypt.hash(body.password, 10);
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Email is used');
    }
  }

  async login(body: registerDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.isActive = 1')
      .andWhere('user.deletedAt is NULL')
      .andWhere('user.email = :email', { email: body.username })
      .getOne();
    if (!user) throw new BadRequestException('invalid username or password');
    if (!(await bcrypt.compare(body.password, user.password)))
      throw new BadRequestException('invalid username or password');
    return this.signUser(user);
  }

  signUser(user: User) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
  }
}
