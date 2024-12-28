import { Document } from 'mongoose';
import { IOrganization } from './organization.interface';

export interface IInvitation extends Document {
  inviterUserId: string;
  organization: IOrganization;
  inviteeUserId: string;
  email: string;
  status: string;
}
