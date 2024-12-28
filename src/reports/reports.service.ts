import { Inject, Injectable } from '@nestjs/common';
import { IReport } from './interfaces/report.interface';
import mongoose, { Model } from 'mongoose';
import { ITemplate } from 'src/templates/interfaces/template.interface';
import { TemplatesService } from 'src/templates/templates.service';

@Injectable()
export class ReportsService {
  constructor(
    @Inject('REPORT_MODEL')
    private reportModel: Model<IReport>,

    readonly templateService: TemplatesService,
  ) {}

  async getAllReports(userId: string) {
    return await this.reportModel.find({ createdBy: userId }).sort({
      modifiedAt: -1,
    });
  }

  async getReports(getReportsDto) {
    return await this.reportModel.find(getReportsDto).sort({
      modifiedAt: -1,
    });
  }

  async getRecentReports(getRecentReportsDto) {
    return this.reportModel
      .find({ createdBy: getRecentReportsDto.userId })
      .sort({
        modifiedAt: -1,
      })
      .limit(10);
  }

  async findOrCreateReport(
    id: string,
    userId: string,
    templateId: string,
    organizationId: mongoose.Types.ObjectId,
  ) {
    if (!id) {
      return;
    }
    const report = await this.reportModel.findById(id);
    const reportTemplate =
      await this.templateService.getTemplateById(templateId);

    if (report) {
      return report;
    }

    const reportObj = new this.reportModel({
      _id: id,
      data: reportTemplate.data,
      templateId: templateId,
      createdBy: userId,
      organizationId,
      createAt: Date.now(),
      modifiedAt: Date.now(),
    });

    const result = await reportObj.save();
    return result;
  }

  async deleteReport(reportId: string): Promise<IReport> {
    const template = await this.reportModel.findOneAndDelete({
      _id: reportId,
    });

    return template;
  }

  async deleteReportsByOrganization(organizationId: mongoose.Types.ObjectId) {
    await this.reportModel.deleteMany({
      organizationId,
    });
  }

  async getAnnualAggregate(userId: string, currentYear) {
    return this.reportModel.aggregate([
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
