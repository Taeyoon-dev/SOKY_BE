// config/swagger.config.ts
import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API Docs')
  .setDescription('NestJS Swagger 예시')
  .setVersion('1.0')
  .build();
