import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private async issueTokens(userId: string, role: string) {
    const accessToken = await this.jwt.signAsync(
      { sub: userId, role },
      { secret: process.env.JWT_ACCESS_SECRET ?? 'dev_access_secret', expiresIn: process.env.JWT_ACCESS_TTL ?? '15m' },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: userId },
      { secret: process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret', expiresIn: process.env.JWT_REFRESH_TTL ?? '7d' },
    );
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt: new Date(Date.now() + 7 * 864e5) },
    });
    return { accessToken, refreshToken };
  }

  /** ออก token ให้ user โดยตรง (ใช้กับ OAuth) */
  async issueForUser(userId: string, role: string) {
    return this.issueTokens(userId, role);
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash, firstName: dto.firstName, lastName: dto.lastName },
    });
    return this.issueTokens(user.id, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    return this.issueTokens(user.id, user.role);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret',
      });
      const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
      const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
      if (!stored || stored.revokedAt) throw new UnauthorizedException();
      await this.prisma.refreshToken.update({ where: { tokenHash }, data: { revokedAt: new Date() } });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      return this.issueTokens(user.id, user.role);
    } catch {
      throw new UnauthorizedException('refresh token ไม่ถูกต้อง');
    }
  }
}
