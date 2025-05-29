import { Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { FavouritesController } from './favourites.controller';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';

@Module({
  controllers: [FavouritesController],
  providers: [FavouritesService, AlbumService, ArtistService, TrackService],
})
export class FavouritesModule {}
