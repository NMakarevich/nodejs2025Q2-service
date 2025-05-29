import { Injectable } from '@nestjs/common';
import { User } from '../resources/user/entities/user.entity';
import { Track } from '../resources/track/entities/track.entity';
import { Album } from '../resources/album/entities/album.entity';
import { Artist } from '../resources/artist/entities/artist.entity';

@Injectable()
class Database<E extends { id: string }> {
  private entities: E[] = [];

  create = (entity: E) => {
    this.entities.push(entity);
    return entity;
  };

  findAll = () => {
    return this.entities;
  };

  findOne = (id: string) => {
    return this.entities.find((entity) => entity.id === id);
  };

  update = (id: string, dto: Partial<E>) => {
    const entity = this.findOne(id);
    return Object.assign(entity, dto);
  };

  delete = (id: string) => {
    const entity = this.findOne(id);
    if (!entity) return false;
    this.entities = this.entities.filter((entity) => entity.id !== id);
    return true;
  };
}

export const userDB = new Database<User>();
export const trackDB = new Database<Track>();
export const albumDB = new Database<Album>();
export const artistDB = new Database<Artist>();
