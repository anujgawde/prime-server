import { Connection } from 'mongoose';
import { OrganizationSchema } from './schemas/organization.schema';
import { InvitationSchema } from './schemas/invitation.schema';

export const organizationProviders = [
  {
    provide: 'ORGANIZATION_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Organization', OrganizationSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'INVITATION_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Invitation', InvitationSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
