import { Inject, Injectable } from '@nestjs/common';
import { IOrganization } from './interfaces/organization.interface';
import mongoose, { Model, Types } from 'mongoose';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/interfaces/user.interface';
import { IInvitation } from './interfaces/invitation.interface';
import { InviteEmployeeDto } from './dto/invite-employee.dto';
import { InvitationResponseDto } from './dto/invitation-response.dto';
import { LeaveOrganizationDto } from './dto/leave-organization.dto';
import { RemoveEmployeeDto } from './dto/remove-employee.dto';
import { ReportsService } from 'src/reports/reports.service';
import { TemplatesService } from 'src/templates/templates.service';
import { DeleteOrganizationDto } from './dto/delete-organization.dto';
import { PromoteEmployeeDto } from './dto/promote-employee.dto';
import { DemoteEmployeeDto } from './dto/demote-employee.dto';
import { EditOrganizationDto } from './dto/edit-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject('ORGANIZATION_MODEL')
    private organizationModel: Model<IOrganization>,
    @Inject('INVITATION_MODEL')
    private invitationModel: Model<IInvitation>,
    private usersService: UsersService,
    private templatesService: TemplatesService,
    private reportsService: ReportsService,
  ) {}

  async getOrganizations(): Promise<IOrganization[]> {
    return await this.organizationModel.find();
  }

  async getOrganizationById(organizationId: string): Promise<IOrganization> {
    return this.organizationModel.findById(organizationId);
  }

  async getEmployeesByOrganization(data): Promise<IUser[]> {
    return this.usersService.getUsersByOrganization(data);
  }

  async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<IOrganization> {
    const newOrganization = new this.organizationModel(createOrganizationDto);

    this.usersService.makeSuperAdmin(newOrganization);
    return await newOrganization.save();
  }

  // Note: Delete organization by deleting all of its data is an option for users for data security reasons. Upcoming: Include soft-delete/disable organization option.
  async deleteOrganization(deleteOrganizationDto: DeleteOrganizationDto) {
    await this.templatesService.deleteTemplatesByOrganization(
      deleteOrganizationDto.organizationId,
    );
    await this.reportsService.deleteReportsByOrganization(
      deleteOrganizationDto.organizationId,
    );
    await this.organizationModel.findByIdAndDelete(
      deleteOrganizationDto.organizationId,
    );
  }

  async editOrganization(editOrganizationDto: EditOrganizationDto) {
    if (editOrganizationDto.editorRole !== 'super-admin') return;
    const { _id, ...rest } = editOrganizationDto.data;

    await this.organizationModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(_id),
      rest,
      {
        new: true,
      },
    );
  }

  async leaveOrganization(leaveOrganizationDto: LeaveOrganizationDto) {
    if (leaveOrganizationDto.organization.roles === 'super-admin') {
      await this.organizationModel.findByIdAndUpdate(
        {
          _id: leaveOrganizationDto.organization.id,
        },
        { $pull: { owners: { _id: leaveOrganizationDto._id } } },
        { new: true },
      );
    }
    await this.usersService.leaveOrganization(leaveOrganizationDto);
  }

  async inviteEmployee(
    inviteEmployeeDto: InviteEmployeeDto,
  ): Promise<IInvitation> {
    const { organizationId, ...rest } = inviteEmployeeDto;

    const inviteeDetails = await this.usersService.getUserByEmail(
      inviteEmployeeDto.email,
    );
    const inviterOrganization = await this.organizationModel.findOne({
      _id: organizationId,
    });

    await this.checkIfAlreadyInvited(inviteeDetails._id, organizationId);

    const addEmployeeData = {
      ...rest,
      organization: inviterOrganization,
      inviteeUserId: inviteeDetails._id,
      email: inviteeDetails.basicInformation.email,
      status: 'pending',
    };

    const newInvitation = new this.invitationModel(addEmployeeData);

    return await newInvitation.save();
  }

  async removeEmployee(removeEmployeeDto: RemoveEmployeeDto) {
    // TODO: Make this globally available data
    const userLevels = {
      'super-admin': 3,
      admin: 2,
      member: 1,
    };

    if (
      userLevels[removeEmployeeDto.employeeOrganization.roles] >
      userLevels[removeEmployeeDto.removerOganization.roles]
    ) {
      // TODO: Throw an exception
      return;
    }

    if (removeEmployeeDto.employeeOrganization.roles === 'super-admin') {
      await this.organizationModel.findByIdAndUpdate(
        {
          _id: removeEmployeeDto.employeeOrganization.id,
        },
        { $pull: { owners: { _id: removeEmployeeDto.employeeId } } },
        { new: true },
      );
    }
    await this.usersService.removeEmployee(removeEmployeeDto);
  }

  async promoteEmployee(promoteEmployeeDto: PromoteEmployeeDto) {
    if (promoteEmployeeDto.newRole === 'super-admin') {
      await this.organizationModel.findByIdAndUpdate(
        {
          _id: promoteEmployeeDto.employeeOrganization.id,
        },
        { $push: { owners: { _id: promoteEmployeeDto.employeeId } } },
        { new: true },
      );
    }
    await this.usersService.promoteEmployee(promoteEmployeeDto);
  }

  async demoteEmployee(demoteEmployeeDto: DemoteEmployeeDto) {
    if (demoteEmployeeDto.newRole === 'admin') {
      await this.organizationModel.findByIdAndUpdate(
        {
          _id: demoteEmployeeDto.employeeOrganization.id,
        },
        { $pull: { owners: { _id: demoteEmployeeDto.employeeId } } },
        { new: true },
      );
    }
    await this.usersService.promoteEmployee(demoteEmployeeDto);
  }

  // TODO: This can be shifted to user's model since it's activity is directly related to the user.
  async respondToInvite(
    invitationResponseDto: InvitationResponseDto,
  ): Promise<IInvitation> {
    if (invitationResponseDto.action) {
      await this.usersService.acceptInvitation(
        new Types.ObjectId(invitationResponseDto.organizationId),
        invitationResponseDto.inviteeUserId,
      );
    }

    return await this.invitationModel.findOneAndUpdate(
      { _id: invitationResponseDto.invitationId },
      { status: invitationResponseDto.action ? 'accepted' : 'rejected' },
      { new: true },
    );
  }

  // TODO: This can be shifted to user's model since it's activity is directly related to the user.
  async getInvitationsByUser(userInvitationData): Promise<IInvitation[]> {
    return await this.invitationModel.find({
      inviteeUserId: userInvitationData.userId,
      status: 'pending',
    });
  }

  async checkIfAlreadyInvited(
    userId: string,
    organizationId: string,
  ): Promise<boolean> {
    const invitationsResponse = await this.invitationModel.findOneAndUpdate(
      {
        'organization._id': new mongoose.Types.ObjectId(organizationId),
        inviteeUserId: userId,
      },
      {
        $set: { status: 'expired' },
      },
      {
        new: true, // Return the updated document
        upsert: false, // Do not create a new document if no match is found
      },
    );

    if (!invitationsResponse) {
      return false;
    }

    return true;
  }
}
