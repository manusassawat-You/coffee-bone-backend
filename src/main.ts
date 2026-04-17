import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TypedConfigService } from './config/typed-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const typedConfigService = app.get(TypedConfigService);

  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin:
      typedConfigService.get('CORS_ORIGIN') ??
      typedConfigService.get('FRONTEND_URL') ??
      'http://localhost:3000',
  });

  const config = new DocumentBuilder()
    .setTitle('Fakebuck API')
    .setDescription('This is a simple Fakebuck api')
    .setVersion('2.2')
    .addServer(
      process.env.NODE_ENV === 'production'
        ? (typedConfigService.get('APP_URL') ??
            'https://coffee-bone-backend.onrender.com')
        : 'http://localhost:8000',
    )
    .addBearerAuth({ type: 'http', scheme: 'bearer' })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(typedConfigService.get('PORT'));
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error(
    'Nest application failed during bootstrap',
    error instanceof Error ? error.message : 'Unexpected occurred error',
  );
});
