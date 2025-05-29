import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Database } from '../../db/database';
import { Album } from './entities/album.entity';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from '../track/track.service';
import { UpdateTrackDto } from '../track/dto/update-track.dto';

@Injectable()
export class AlbumService {
  constructor(
    private readonly albumDB: Database<Album>,
    private readonly trackService: TrackService,
  ) {}
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
    const tracks = this.trackService
      .findAll()
      .filter((track) => track.albumId === id);
    tracks.forEach((track) =>
      this.trackService.update(track.id, { albumId: null } as UpdateTrackDto),
    );
    return this.albumDB.delete(id);
  }
}
