import mongoose from 'mongoose';

export class InvitationResponseDto {
  invitationId: mongoose.Types.ObjectId;
  organizationId: string;
  inviteeUserId: string;
  action: boolean;
}
