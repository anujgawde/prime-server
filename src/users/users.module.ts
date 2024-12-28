import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { databaseProviders } from 'src/database/database.provider';
import { userProviders } from './users.provider';
import { reportProviders } from 'src/reports/reports.provider';
import { templateProviders } from 'src/templates/templates.provider';
import { ReportsService } from 'src/reports/reports.service';
import { TemplatesService } from 'src/templates/templates.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    ReportsService,
    TemplatesService,
    ...databaseProviders,
    ...userProviders,
    ...reportProviders,
    ...templateProviders,
  ],
})
export class UsersModule {}
