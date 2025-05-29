import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './resources/user/user.module';
import { TrackModule } from './resources/track/track.module';
import { AlbumModule } from './resources/album/album.module';

@Module({
  imports: [UserModule, TrackModule, AlbumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
