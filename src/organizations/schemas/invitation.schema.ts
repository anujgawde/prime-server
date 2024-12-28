import * as mongoose from 'mongoose';

export const InvitationSchema = new mongoose.Schema(
  {
    inviterUserId: String,
    organization: Object,
    inviteeUserId: String,
    email: String,
    status: String,
  },
  {
    timestamps: true,
  },
);
