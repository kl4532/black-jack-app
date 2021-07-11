
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema()
export class Player {
  @Prop()
  name: string;

  @Prop()
  score: number;

  @Prop()
  date: Date;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
