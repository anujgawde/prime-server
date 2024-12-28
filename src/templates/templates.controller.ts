import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { ITemplate } from './interfaces/template.interface';
import { OrganizationTemplatesResponseDto } from './dto/orgnization-templates-response.dto';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templateService: TemplatesService) {}

  @Post('/')
  getTemplates(@Body() getTemplatesDto) {
    return this.templateService.getTemplates(getTemplatesDto);
  }

  @Get('/:userId')
  getTemplatesByUser(@Param('userId') userId: string) {
    return this.templateService.getTemplatesByUser(userId);
  }

  @Post('/most-used')
  getMostUsedTemplates(@Body() mostUsedTemplatesDto) {
    return this.templateService.getMostUsedTemplates(mostUsedTemplatesDto);
  }
  @Post('/get-organization-templates')
  getTemplatesByOrganization(
    @Body() organizationTemplatesResponseDto: OrganizationTemplatesResponseDto,
  ) {
    return this.templateService.getTemplatesByOrganization(
      organizationTemplatesResponseDto,
    );
  }

  @Post('/delete')
  deleteTempalte(
    @Body() templateData: Record<string, string>,
  ): Promise<ITemplate> {
    return this.templateService.deleteTemplate(templateData.data);
  }
}
