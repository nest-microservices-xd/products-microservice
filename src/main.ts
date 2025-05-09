import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { Logger } from '@nestjs/common';

import { envs } from './config/envs';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  console.log(envs.natsServers);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  logger.log(`Products Microservice is listening on port ${envs.port}`);
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap', err);
});
