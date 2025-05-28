import { Injectable } from '@nestjs/common';

@Injectable()
export class Database<E extends { id: string }> {
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
