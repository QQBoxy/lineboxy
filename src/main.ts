import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Session
  app.use(
    session({
      name: 'lineboxy_session_id',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 2592000000, //30 * 24 * 60 * 60 * 1000 = 30 day
      },
    }),
  );

  // Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('LineBoxy')
    .setDescription('This is the API document for the LineBoxy server.')
    .setVersion('1.0')
    .addCookieAuth('lineboxy_session_id')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
