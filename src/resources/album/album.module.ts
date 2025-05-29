import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Database } from '../../db/database';
import { TrackService } from '../track/track.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, Database, TrackService],
})
export class AlbumModule {}
