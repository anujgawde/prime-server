import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { ReportsService } from './reports.service';
import { IReport } from './interfaces/report.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ReportsGateway implements OnGatewayInit {
  constructor(
    private readonly reportService: ReportsService,
    @Inject('REPORT_MODEL')
    private reportModel: Model<IReport>,
  ) {}

  @WebSocketServer() socket;

  @SubscribeMessage('get-report')
  async getReport(
    @MessageBody() reportData,
    @ConnectedSocket() client: Socket,
  ) {
    const report = await this.reportService.findOrCreateReport(
      reportData.docReference,
      reportData.userId,
      reportData.templateId,
      reportData.organizationId,
    );

    client.join(reportData.docReference);

    this.socket.emit('load-report', {
      data: report.data,
      name: report.name,
    });
  }

  @SubscribeMessage('send-changes')
  async sendChanges(
    @MessageBody() reportData,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast
      .to(reportData.documentId)
      .emit('receive-changes', reportData.delta);
  }

  @SubscribeMessage('save-report')
  async saveReport(
    @MessageBody() reportData,
    @ConnectedSocket() client: Socket,
  ) {
    await this.reportModel.findByIdAndUpdate(reportData.docReference, {
      data: reportData.quillData,
      modifiedAt: Date.now(),
    });
  }

  @SubscribeMessage('update-report-details')
  async updateReportpDetails(@MessageBody() reportData) {
    await this.reportModel.findByIdAndUpdate(reportData.docReference, {
      name: reportData.name,
    });
  }

  afterInit(server: any) {
    console.log('server');
  }
}
