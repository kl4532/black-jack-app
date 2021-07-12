import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from "@nestjs/config";

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    PlayersModule,
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    MongooseModule.forRoot(
      ENV ? process.env.DB_URL_PROD : process.env.DB_URL_DEV,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
