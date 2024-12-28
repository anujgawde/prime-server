import { Inject, Injectable } from '@nestjs/common';
import mongoose, { Model, Types } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ReportsService } from 'src/reports/reports.service';
import { TemplatesService } from 'src/templates/templates.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<IUser>,
    private reportsService: ReportsService,
    private templatesService: TemplatesService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const user = new this.userModel(createUserDto);
    return await user.save();
  }

  async getUsers(): Promise<IUser[]> {
    return await this.userModel.find();
  }

  async getUserById(userId: string): Promise<IUser> {
    return await this.userModel.findById(userId);
  }

  async getUserByEmail(email: string): Promise<IUser> {
    return await this.userModel.findOne({
      'basicInformation.email': email,
    });
  }

  async updateUserProfile(updateProfileDto: UpdateProfileDto) {
    const { _id, ...rest } = updateProfileDto;
    const updatedUser = await this.userModel.findByIdAndUpdate(
      _id,
      {
        basicInformation: {
          firstName: rest.firstName,
          lastName: rest.lastName,
          email: rest.email,
        },
        contactInformation: {
          address: rest.address,
          phoneNumber: rest.phoneNumber,
        },
      },
      { new: true },
    );
    return updatedUser;
  }

  async leaveOrganization(leaveOrganizationDto) {
    await this.userModel.findOneAndUpdate(
      { _id: leaveOrganizationDto._id },
      { organization: null },
      { new: true },
    );
  }

  async removeEmployee(removeEmployeeDto) {
    await this.userModel.findOneAndUpdate(
      { _id: removeEmployeeDto.userId },
      { organization: null },
      { new: true },
    );
  }

  async promoteEmployee(promoteEmployeeDto) {
    await this.userModel.findOneAndUpdate(
      { _id: promoteEmployeeDto.employeeId },
      {
        $set: { 'organization.roles': promoteEmployeeDto.newRole },
      },
      { new: true },
    );
  }

  async demoteEmployee(demoteEmployeeDto) {
    await this.userModel.findOneAndUpdate(
      { _id: demoteEmployeeDto.employeeId },
      {
        $set: { 'organization.roles': demoteEmployeeDto.newRole },
      },
      { new: true },
    );
  }

  async acceptInvitation(
    organizationId: mongoose.Types.ObjectId,
    userId: string,
  ) {
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { organization: { id: organizationId, roles: 'member' } },
      { new: true },
    );
  }

  async getUsersByOrganization(data) {
    const orgUsers = await this.userModel.find({
      _id: { $ne: data.userId },
      'organization.id': new Types.ObjectId(data.organizationId),
    });

    return orgUsers;
  }

  async makeSuperAdmin(data): Promise<IUser> {
    return await this.userModel.findByIdAndUpdate(data.owners[0]._id, {
      organization: {
        id: data._id,
        roles: 'super-admin',
      },
    });
  }

  async getUserDocsAggregate(userDocsAggregateDto) {
    // Aggregate documents month-wise
    const currentYear = new Date().getFullYear();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Initial counts for each month set to 0
    let countByMonth = monthNames.map((name, index) => {
      return {
        month: name,
        documentCount: 0,
        templateCount: 0,
      };
    });

    const reportAnnualAggregate = await this.reportsService.getAnnualAggregate(
      userDocsAggregateDto.userId,
      currentYear,
    );

    const templateAnnualAggregate =
      await this.templatesService.getAnnualAggregate(
        userDocsAggregateDto.userId,
        currentYear,
      );

    // Update the documentCountByMonth array with the counts from the aggregation
    reportAnnualAggregate.forEach(({ _id, count }) => {
      countByMonth[_id - 1].documentCount = count; // _id - 1 because array is 0-indexed
    });

    templateAnnualAggregate.forEach(({ _id, count }) => {
      countByMonth[_id - 1].templateCount = count; // _id - 1 because array is 0-indexed
    });

    return countByMonth;
  }
}
