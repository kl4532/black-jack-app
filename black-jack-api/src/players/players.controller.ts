import { Controller, Get, Post, Body} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from "./dto/create-player.dto";

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  findAll() {
    return this.playersService.findAll();
  }

}
