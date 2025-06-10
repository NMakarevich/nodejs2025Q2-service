import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    return this.prisma.album.create({
      data: createAlbumDto,
      include: {
        artist: true,
      },
    });
  }

  async findAll() {
    return this.prisma.album.findMany({
      include: {
        artist: true,
      },
    });
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
      include: { artist: true },
    });
    if (!album)
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findOne(id);
    if (!album)
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    return this.prisma.album.update({
      where: { id },
      data: updateAlbumDto,
      include: {
        artist: true,
      },
    });
  }

  async remove(id: string) {
    const album = await this.findOne(id);
    if (!album)
      throw new HttpException('Album is not found', HttpStatus.NOT_FOUND);
    return this.prisma.album.delete({ where: { id } });
  }
}
