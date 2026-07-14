import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import type { NestExpressApplication } from '@nestjs/platform-express';
import * as argon2 from 'argon2';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  // เพิ่ม limit ของ body (รองรับรูปแนบ base64 หลายใบ) — ใช้ body parser ในตัวของ Nest ไม่ต้อง import express
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  app.useBodyParser('json', { limit: '20mb' });

  app.use(helmet());
  app.enableCors({
    origin: (process.env.APP_URL ?? 'http://localhost:3000').split(','),
    credentials: true,
  });
  app.setGlobalPrefix('', { exclude: ['health'] });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('GADGET VILLA API')
    .setDescription('Enterprise E-Commerce API — Fantech & UGREEN')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${port} · docs at /docs`);

  // ---- Bootstrap master data + admin (รันหลัง listen เพื่อให้ port bind เร็ว กัน Render port-scan timeout) ----
  try {
    const prisma = app.get(PrismaService);

    // แบรนด์
    for (const b of [
      { slug: 'fantech', name: 'Fantech' },
      { slug: 'ugreen', name: 'UGREEN' },
    ]) {
      await prisma.brand.upsert({ where: { slug: b.slug }, update: {}, create: b });
    }

    // หมวดหมู่จริง 20 หมวด
    const cats: [string, string][] = [
      ['gaming-chair', 'เก้าอี้เกมมิ่ง'], ['keyboard', 'คีย์บอร์ด'], ['mouse', 'เมาส์'], ['headset', 'หูฟัง'],
      ['mousepad', 'แผ่นรองเมาส์'], ['controller', 'จอยเกม'], ['webcam', 'เว็บแคม'], ['streaming', 'อุปกรณ์สตรีม'],
      ['nas', 'NAS / NASync'], ['gan-charger', 'ที่ชาร์จ GaN'], ['usb-charger', 'ที่ชาร์จ USB'], ['powerbank', 'พาวเวอร์แบงก์'],
      ['dock', 'Docking Station'], ['usb-hub', 'USB Hub'], ['hdmi', 'อุปกรณ์ HDMI'], ['display-adapter', 'ตัวแปลงจอ'],
      ['usb-cable', 'สาย USB'], ['charging-cable', 'สายชาร์จ'], ['bluetooth-adapter', 'Bluetooth Adapter'], ['card-reader', 'Card Reader'],
    ];
    for (let i = 0; i < cats.length; i++) {
      await prisma.category.upsert({
        where: { slug: cats[i][0] },
        update: { name: cats[i][1] },
        create: { slug: cats[i][0], name: cats[i][1], sortOrder: i + 1 },
      });
    }

    // คลังหลัก
    await prisma.warehouse.upsert({
      where: { code: 'MAIN' },
      update: {},
      create: { code: 'MAIN', name: 'คลังหลัก GADGET VILLA' },
    });

    // admin จาก env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      const passwordHash = await argon2.hash(adminPassword);
      await prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: 'SUPER_ADMIN', isActive: true },
        create: {
          email: adminEmail,
          passwordHash,
          firstName: 'Admin',
          role: 'SUPER_ADMIN',
          isActive: true,
          emailVerified: new Date(),
        },
      });
    }
    // eslint-disable-next-line no-console
    console.log('✅ Bootstrap: brands/categories/warehouse/admin พร้อมใช้งาน');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('bootstrap error:', e);
  }
}
bootstrap();
