import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private prisma: PrismaService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID ?? 'missing',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? 'missing',
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:4000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: {
      id: string;
      emails?: { value: string }[];
      name?: { givenName?: string; familyName?: string };
      photos?: { value: string }[];
    },
    done: VerifyCallback,
  ) {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error('Google ไม่ส่งอีเมล'), undefined);

    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          avatarUrl: profile.photos?.[0]?.value,
          emailVerified: new Date(),
          oauthAccounts: { create: { provider: 'google', providerUserId: profile.id } },
        },
      });
    }
    return done(null, { id: user.id, email: user.email, role: user.role });
  }
}
