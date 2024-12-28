import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { TemplatesService } from './templates.service';
import { Inject } from '@nestjs/common';
import { ITemplate } from './interfaces/template.interface';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TemplateGateway implements OnGatewayInit {
  constructor(
    private readonly templateService: TemplatesService,
    @Inject('TEMPLATE_MODEL')
    private templateModel: Model<ITemplate>,
  ) {}

  @WebSocketServer() socket;

  @SubscribeMessage('get-template')
  async getTemplate(
    @MessageBody() templateData,
    @ConnectedSocket() client: Socket,
  ) {
    const template = await this.templateService.findOrCreateTemplate(
      templateData.docReference,
      templateData.userId,
      templateData.organizationId,
    );

    client.join(templateData.docReference);

    this.socket.emit('load-template', {
      data: template.data,
      name: template.name,
    });
  }

  @SubscribeMessage('send-changes')
  async sendChanges(
    @MessageBody() templateData,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast
      .to(templateData.documentId)
      .emit('receive-changes', templateData.delta);
  }

  @SubscribeMessage('save-template')
  async saveTemplate(
    @MessageBody() templateData,
    @ConnectedSocket() client: Socket,
  ) {
    await this.templateModel.findByIdAndUpdate(templateData.docReference, {
      data: templateData.quillData,
      modifiedAt: Date.now(),
    });
  }

  @SubscribeMessage('update-template-details')
  async updateTemplateDetails(@MessageBody() templateData) {
    await this.templateModel.findByIdAndUpdate(templateData.docReference, {
      name: templateData.name,
    });
  }

  @SubscribeMessage('get-report')
  async getReport(
    @MessageBody() reportData,
    @ConnectedSocket() client: Socket,
  ) {}

  afterInit(server: any) {
    console.log('server');
  }
}
