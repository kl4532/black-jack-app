import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player, PlayerDocument } from './player.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PlayersService {
  constructor(@InjectModel(Player.name) private playerModel: Model<PlayerDocument>) {
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(createPlayerDto);
    console.log('Creation...');
    return createdPlayer.save();
  }

  async findAll(): Promise<Player[]> {
    const res = this.playerModel.find().exec();
    console.log('Players', await res);
    return res;
  }
}
