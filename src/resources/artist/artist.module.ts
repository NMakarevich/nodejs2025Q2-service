import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, AlbumService, TrackService],
  imports: [PrismaModule],
})
export class ArtistModule {}
