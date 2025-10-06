import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WebhookLog extends Document {
  @Prop({ type: Object, required: true })
  payload: any;

  @Prop({ required: true })
  status: number;

  @Prop()
  order_id: string;

  @Prop()
  processed: boolean;

  @Prop()
  error: string;

  @Prop()
  ip_address: string;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);

// Create indexes
WebhookLogSchema.index({ order_id: 1 });
WebhookLogSchema.index({ createdAt: -1 });
WebhookLogSchema.index({ processed: 1 });