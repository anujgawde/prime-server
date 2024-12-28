import { Inject, Injectable } from '@nestjs/common';
import { ITemplate } from './interfaces/template.interface';
import mongoose, { Model } from 'mongoose';
import { OrganizationTemplatesResponseDto } from './dto/orgnization-templates-response.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @Inject('TEMPLATE_MODEL')
    private templateModel: Model<ITemplate>,
  ) {}

  async getTemplates(getTemplatesDto) {
    return await this.templateModel.find(getTemplatesDto).sort({
      modifiedAt: -1,
    });
  }

  async getTemplatesByUser(userId: string) {
    return await this.templateModel.find({ createdBy: userId }).sort({
      modifiedAt: -1,
    });
  }

  async getTemplatesByOrganization(
    organizationTemplatesResponseDto: OrganizationTemplatesResponseDto,
  ) {
    return await this.templateModel
      .find({ _id: organizationTemplatesResponseDto.organizationId })
      .sort({
        modifiedAt: -1,
      });
  }

  async getTemplateById(templateId: string) {
    return await this.templateModel.findById(templateId);
  }

  async getMostUsedTemplates(mostUsedTemplatesDto) {
    const topTemplates = this.templateModel.aggregate([
      {
        $match: { createdBy: mostUsedTemplatesDto.userId }, // Filter by userId
      },
      {
        $group: {
          _id: '$_id', // Group by templateId
          count: { $sum: 1 }, // Count the number of documents per template
        },
      },
      {
        $sort: { count: -1 }, // Sort by count in descending order
      },
      {
        $limit: 5, // Limit to the top 5 templates
      },
    ]);

    // Extract the templateIds from the aggregation result
    const templateIds = (await topTemplates).map((template) => template._id);

    // Fetch the template details using the templateIds
    return await this.templateModel.find({ _id: { $in: templateIds } });
  }

  async findOrCreateTemplate(
    id: string,
    userId: string,
    organizationId: mongoose.Types.ObjectId,
  ) {
    if (!id) {
      return;
    }
    const template = await this.templateModel.findById(id);

    if (template) {
      return template;
    }

    const templateObj = new this.templateModel({
      _id: id,
      data: '',
      organizationId,
      createdBy: userId,
      createAt: Date.now(),
      modifiedAt: Date.now(),
    });
    const result = await templateObj.save();
    return result;
  }

  async deleteTemplate(templateId: string): Promise<ITemplate> {
    const template = await this.templateModel.findOneAndDelete({
      _id: templateId,
    });

    return template;
  }

  async deleteTemplatesByOrganization(organizationId: mongoose.Types.ObjectId) {
    await this.templateModel.deleteMany({
      organizationId,
    });
  }

  async getAnnualAggregate(userId: string, currentYear) {
    return this.templateModel.aggregate([
      {
        $match: {
          createdBy: userId,
          createAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createAt' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }
}
