import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 as uuidv4 } from 'uuid';

import { artistDB } from '../../db/database';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class ArtistService {
  private artistDB = artistDB;

  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    const id = uuidv4();
    return this.artistDB.create({ id, ...createArtistDto });
  }

  findAll() {
    return this.artistDB.findAll();
  }

  findOne(id: string) {
    const artist = this.artistDB.findOne(id);
    if (!artist)
      throw new HttpException('Artist is not found', HttpStatus.NOT_FOUND);
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.artistDB.findOne(id);
    if (!artist)
      throw new HttpException('Artist is not found', HttpStatus.NOT_FOUND);
    return this.artistDB.update(id, updateArtistDto);
  }

  remove(id: string) {
    const artist = this.artistDB.findOne(id);
    if (!artist)
      throw new HttpException('Artist is not found', HttpStatus.NOT_FOUND);
    this.trackService.removeArtistId(id);
    this.albumService.removeArtistId(id);
    return this.artistDB.delete(id);
  }
}
