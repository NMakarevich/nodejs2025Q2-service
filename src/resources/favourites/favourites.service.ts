import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { favsDB } from '../../db/database';
import { FavouriteInterface } from './entities/favourite.entity';

@Injectable()
export class FavouritesService {
  private favsDB = favsDB;

  constructor(
    private readonly trackService: TrackService,

    private readonly albumService: AlbumService,

    private readonly artistService: ArtistService,
  ) {}
  findAll() {
    const favs = this.favsDB.findAll();
    const response: FavouriteInterface = {
      artists: favs.artists
        .map((id) => {
          try {
            return this.artistService.findOne(id);
          } catch {
            this.favsDB.deleteArtist(id);
          }
        })
        .filter((artist) => artist),
      albums: favs.albums
        .map((id) => {
          try {
            return this.albumService.findOne(id);
          } catch {
            this.favsDB.deleteAlbum(id);
          }
        })
        .filter((album) => album),
      tracks: favs.tracks
        .map((id) => {
          try {
            return this.trackService.findOne(id);
          } catch {
            this.favsDB.deleteTrack(id);
          }
        })
        .filter((track) => track),
    };
    return response;
  }

  addTrack(id: string) {
    try {
      if (this.trackService.findOne(id)) {
        this.favsDB.addTrack(id);
      }
    } catch {
      throw new HttpException(
        'Track is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return { message: 'Track is added to favourites' };
  }

  removeTrack(id: string) {
    if (!this.favsDB.findAll().tracks.includes(id)) {
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    }
    this.favsDB.deleteTrack(id);
    return { message: 'Track is removed from favourites' };
  }

  addArtist(id: string) {
    try {
      if (this.artistService.findOne(id)) {
        this.favsDB.addArtist(id);
      }
    } catch {
      throw new HttpException(
        'Artist is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return { message: 'Artist is added to favourites' };
  }

  removeArtist(id: string) {
    if (!this.favsDB.findAll().artists.includes(id)) {
      throw new HttpException('Artist is not found', HttpStatus.NOT_FOUND);
    }
    this.favsDB.deleteArtist(id);
    return { message: 'Artist is added to favourites' };
  }

  addAlbum(id: string) {
    try {
      if (this.albumService.findOne(id)) {
        this.favsDB.addAlbum(id);
      }
    } catch {
      throw new HttpException(
        'Album is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return { message: 'Album is added to favourites' };
  }

  removeAlbum(id: string) {
    if (!this.favsDB.findAll().albums.includes(id)) {
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    }
    this.favsDB.deleteAlbum(id);
    return { message: 'Album is removed from favourites' };
  }
}
