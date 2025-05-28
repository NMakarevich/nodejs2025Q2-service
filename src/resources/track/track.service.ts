import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Database } from '../../db/database';
import { Track } from './entities/track.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  constructor(private readonly tracksDB: Database<Track>) {}

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
}
