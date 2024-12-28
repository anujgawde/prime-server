import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { organizationProviders } from './organizations.provider';
import { databaseProviders } from 'src/database/database.provider';
import { userProviders } from 'src/users/users.provider';
import { UsersService } from 'src/users/users.service';
import { TemplatesService } from 'src/templates/templates.service';
import { ReportsService } from 'src/reports/reports.service';
import { templateProviders } from 'src/templates/templates.provider';
import { reportProviders } from 'src/reports/reports.provider';

@Module({
  providers: [
    OrganizationsService,
    ...organizationProviders,
    ...databaseProviders,
    ...userProviders,
    UsersService,
    ...templateProviders,
    TemplatesService,
    ...reportProviders,
    ReportsService,
  ],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
