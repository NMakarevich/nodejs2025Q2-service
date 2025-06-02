import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { v4 as uuidv4 } from 'uuid';

import { trackDB } from '../../db/database';

@Injectable()
export class TrackService {
  private tracksDB = trackDB;

  create(createTrackDto: CreateTrackDto) {
    const id = uuidv4();
    const track: Track = { id, ...createTrackDto };
    return this.tracksDB.create(track);
  }

  findAll() {
    return this.tracksDB.findAll();
  }

  findOne(id: string) {
    const track = this.tracksDB.findOne(id);
    if (!track)
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.findOne(id);
    if (!track)
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    return this.tracksDB.update(id, updateTrackDto);
  }

  remove(id: string) {
    const track = this.findOne(id);
    if (!track)
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    return this.tracksDB.delete(id);
  }

  removeAlbumId(id: string) {
    const tracks = this.tracksDB
      .findAll()
      .filter((track) => track.albumId === id);
    tracks.forEach((track) => {
      const updateTrackDto = new UpdateTrackDto();
      updateTrackDto.albumId = null;
      this.update(track.id, updateTrackDto);
    });
  }

  removeArtistId(id: string) {
    const tracks = this.tracksDB
      .findAll()
      .filter((track) => track.artistId === id);
    tracks.forEach((track) => {
      const updateTrackDto = new UpdateTrackDto();
      updateTrackDto.artistId = null;
      this.update(track.id, updateTrackDto);
    });
  }
}
