import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from '../track/track.service';

import { albumDB } from '../../db/database';

@Injectable()
export class AlbumService {
  private albumDB = albumDB;
  constructor(private readonly trackService: TrackService) {}
  create(createAlbumDto: CreateAlbumDto) {
    const id = uuidv4();
    return this.albumDB.create({ id, ...createAlbumDto });
  }

  findAll() {
    return this.albumDB.findAll();
  }

  findOne(id: string) {
    const album = this.albumDB.findOne(id);
    if (!album)
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.albumDB.findOne(id);
    if (!album)
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    return this.albumDB.update(id, updateAlbumDto);
  }

  remove(id: string) {
    const album = this.albumDB.findOne(id);
    if (!album)
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    this.trackService.removeAlbumId(id);
    return this.albumDB.delete(id);
  }

  removeArtistId(id: string) {
    const tracks = this.albumDB
      .findAll()
      .filter((track) => track.artistId === id);
    tracks.forEach((track) => {
      const updateAlbumDto = new UpdateAlbumDto();
      updateAlbumDto.artistId = null;
      this.update(track.id, updateAlbumDto);
    });
  }
}
