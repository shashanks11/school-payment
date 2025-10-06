import { Controller, Post, Body, Get, Query, Ip, UseGuards } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhookDto } from './dto/webhook.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  // Webhook endpoint - NO AUTH (payment gateway calls this)
  @Post()
  async handleWebhook(@Body() webhookDto: WebhookDto, @Ip() ip: string) {
    return this.webhooksService.handleWebhook(webhookDto, ip);
  }

  // Protected endpoint to view webhook logs
  @UseGuards(JwtAuthGuard)
  @Get('logs')
  async getWebhookLogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.webhooksService.getWebhookLogs(page, limit);
  }
}