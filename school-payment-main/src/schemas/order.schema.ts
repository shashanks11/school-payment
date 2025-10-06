import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class StudentInfo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  email: string;
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  school_id: Types.ObjectId | string;

  @Prop({ type: Types.ObjectId, required: true })
  trustee_id: Types.ObjectId | string;

  @Prop({ type: StudentInfo, required: true })
  student_info: StudentInfo;

  @Prop({ required: true })
  gateway_name: string;

  @Prop({ unique: true })
  custom_order_id: string;

  // CRITICAL FIX: Changed from no type to String
  @Prop({ type: String, index: true })
  collect_id: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ school_id: 1 });
OrderSchema.index({ custom_order_id: 1 });
OrderSchema.index({ collect_id: 1 });