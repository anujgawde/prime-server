import { Connection } from 'mongoose';
import { ReportSchema } from './schemas/report.schema';

export const reportProviders = [
  {
    provide: 'REPORT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Report', ReportSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
