import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    PlayersModule,
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'development'
        ? process.env.DB_URL_DEV
        : process.env.DB_URL_PROD,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
