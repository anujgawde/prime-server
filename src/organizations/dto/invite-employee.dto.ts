export class InviteEmployeeDto {
  organizationId: string;
  inviterUserId: string;
  email: string;
  status: 'pending' | 'accepted' | 'denied' | 'expired';
}
