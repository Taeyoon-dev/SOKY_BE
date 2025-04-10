// src/auth/auth.service.ts
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async signUp(dto: SignUpDto): Promise<void> {
    const { email, accountId, password, nickname } = dto;

    const existing = await this.usersRepository.findOne({
      where: [{ email }, { accountId }, { nickname }],
    });

    if (existing) {
      throw new ConflictException('이미 존재하는 사용자 정보입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      accountId,
      password: hashedPassword,
      nickname,
    });

    await this.usersRepository.save(user);
  }

  async signIn(dto: SignInDto): Promise<{ accessToken: string }> {
    const { accountId, password } = dto;

    const user = await this.usersRepository.findOne({ where: { accountId } });
    if (!user) throw new UnauthorizedException('잘못된 아이디 또는 비밀번호');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('잘못된 아이디 또는 비밀번호');

    const payload = { sub: user.id, accountId: user.accountId };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
