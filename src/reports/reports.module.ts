import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { databaseProviders } from 'src/database/database.provider';
import { reportProviders } from './reports.provider';
import { ReportsGateway } from './reports.gateway';
import { TemplatesService } from 'src/templates/templates.service';
import { TemplatesModule } from 'src/templates/templates.module';
import { templateProviders } from 'src/templates/templates.provider';

@Module({
  providers: [
    ReportsService,
    ReportsGateway,
    TemplatesService,
    ...databaseProviders,
    ...reportProviders,
    ...templateProviders,
  ],
  controllers: [ReportsController],
  imports: [],
})
export class ReportsModule {}
