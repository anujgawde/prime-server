import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IOrganization } from './interfaces/organization.interface';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteEmployeeDto } from './dto/invite-employee.dto';
import { InvitationResponseDto } from './dto/invitation-response.dto';
import { LeaveOrganizationDto } from './dto/leave-organization.dto';
import { RemoveEmployeeDto } from './dto/remove-employee.dto';
import { DeleteOrganizationDto } from './dto/delete-organization.dto';
import { PromoteEmployeeDto } from './dto/promote-employee.dto';
import { EditOrganizationDto } from './dto/edit-organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}
  @Get('')
  getOrganizations(): Promise<IOrganization[]> {
    return this.organizationService.getOrganizations();
  }

  @Get('/:id')
  getOrganizationById(@Param('id') id: string): Promise<IOrganization> {
    return this.organizationService.getOrganizationById(id);
  }

  @Post('/create-organization')
  createOrganization(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.createOrganization(createOrganizationDto);
  }

  @Post('/leave-organization')
  leaveOrganization(@Body() leaveOrganizationDto: LeaveOrganizationDto) {
    return this.organizationService.leaveOrganization(leaveOrganizationDto);
  }

  @Post('/invite-employee')
  inviteEmployee(@Body() inviteEmployeeDto: InviteEmployeeDto) {
    return this.organizationService.inviteEmployee(inviteEmployeeDto);
  }

  @Post('/remove-employee')
  removeEmployee(@Body() removeEmployeeDto: RemoveEmployeeDto) {
    return this.organizationService.removeEmployee(removeEmployeeDto);
  }

  @Post('/promote-employee')
  promoteEmployee(@Body() promoteEmployeeDto: PromoteEmployeeDto) {
    return this.organizationService.promoteEmployee(promoteEmployeeDto);
  }

  @Post('/demote-employee')
  demoteEmployee(@Body() demoteEmployeeDto: PromoteEmployeeDto) {
    return this.organizationService.promoteEmployee(demoteEmployeeDto);
  }

  @Post('/invite-response')
  respondToInvite(@Body() invitationResponseDto: InvitationResponseDto) {
    return this.organizationService.respondToInvite(invitationResponseDto);
  }

  @Post('/get-user-invitations')
  getInvitationsByUser(@Body() userInvitationData) {
    return this.organizationService.getInvitationsByUser(userInvitationData);
  }

  @Post('/get-org-employees')
  getEmployeesByOrganization(@Body() data) {
    return this.organizationService.getEmployeesByOrganization(data);
  }

  @Post('/delete-organization')
  deleteOrganization(@Body() deleteOrganizationDto: DeleteOrganizationDto) {
    return this.organizationService.deleteOrganization(deleteOrganizationDto);
  }

  @Post('/edit-organization')
  editOrganization(@Body() editOrganizationDto: EditOrganizationDto) {
    return this.organizationService.editOrganization(editOrganizationDto);
  }
}
