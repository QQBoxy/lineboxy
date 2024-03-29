import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Session
  app.use(
    session({
      name: 'lineboxy-session-id',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 2592000000, //30 * 24 * 60 * 60 * 1000 = 30 day
      },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('LineBoxy')
    .setDescription('This is the API document for the LineBoxy server.')
    .setVersion('1.0')
    .addCookieAuth('lineboxy-session-id')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
