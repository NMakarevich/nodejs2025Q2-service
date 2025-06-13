import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './resources/user/user.module';
import { TrackModule } from './resources/track/track.module';
import { AlbumModule } from './resources/album/album.module';
import { ArtistModule } from './resources/artist/artist.module';
import { FavouritesModule } from './resources/favourites/favourites.module';
import { AuthModule } from './resources/auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { CustomExceptionFilter } from './logger/exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    UserModule,
    TrackModule,
    AlbumModule,
    ArtistModule,
    FavouritesModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
