import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // ✅ ensures .env works in production builds too

  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for both local & deployed frontend
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://myapp.vercel.app', // optional: add your final frontend URL here
    ],
    credentials: true,
  });

  // ✅ Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // ✅ Prefix all routes with /api
  app.setGlobalPrefix('api');

  // ✅ Dynamic port for Render
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // <- important for Render/hosted platforms

  console.log(`🚀 Backend running on http://localhost:${port}`);
}

bootstrap();
