import { Connection } from 'mongoose';
import { TemplateSchema } from './schemas/template.schema';

export const templateProviders = [
  {
    provide: 'TEMPLATE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Template', TemplateSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
