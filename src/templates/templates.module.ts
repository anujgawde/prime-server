import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { TemplateGateway } from './templates.gateway';
import { databaseProviders } from 'src/database/database.provider';
import { templateProviders } from './templates.provider';

@Module({
  providers: [
    TemplatesService,
    ...databaseProviders,
    ...templateProviders,
    TemplateGateway,
  ],
  controllers: [TemplatesController],
})
export class TemplatesModule {}
