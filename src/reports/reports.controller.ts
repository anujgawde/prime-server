import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IReport } from './interfaces/report.interface';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/:userId')
  getAllReports(@Param('userId') userId: string) {
    return this.reportsService.getAllReports(userId);
  }

  @Post('/')
  getReports(@Body() getReportsDto) {
    return this.reportsService.getReports(getReportsDto);
  }

  @Post('/recent')
  getRecentReports(@Body() getRecentReportsDto): Promise<IReport[]> {
    return this.reportsService.getRecentReports(getRecentReportsDto);
  }

  @Post('/delete')
  deleteReport(
    @Body() deleteReportData: Record<string, string>,
  ): Promise<IReport> {
    return this.reportsService.deleteReport(deleteReportData.data);
  }
}
