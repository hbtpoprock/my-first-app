import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Disable the default _id field and use your custom `id`
@Schema({ timestamps: true })
export class TopToken {
  @Prop({ required: true })
  _id: string; // This will be used as the unique identifier, and you can set it as `_id` manually

  @Prop()
  name: string;

  @Prop()
  symbol: string;

  @Prop()
  derivedETH: string;

  @Prop()
  tradeVolume: string;

  @Prop()
  tradeVolumeETH: string;

  @Prop()
  untrackedVolumeETH: string;

  @Prop()
  totalLiquidity: string;

  @Prop()
  txCount: string;

  @Prop()
  volume24HrsETH: number;

  @Prop()
  volume24HrsUSD: number;

  @Prop()
  txCount24Hrs: number;

  @Prop()
  tradeVolumeUSD: string;

  @Prop()
  totalLiquidityUSD: string;

  @Prop()
  derivedUSD: string;
}

export type TopTokenDocument = TopToken & Document;
export const TopTokenSchema = SchemaFactory.createForClass(TopToken);
