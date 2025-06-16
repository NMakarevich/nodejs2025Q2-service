import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto) {
    return this.prisma.artist.create({ data: createArtistDto });
  }

  async findAll() {
    return this.prisma.artist.findMany({
      include: {
        albums: true,
      },
    });
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: { albums: true },
    });
    if (!artist)
      throw new HttpException('Artist is not found', HttpStatus.NOT_FOUND);
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id);
    if (!artist)
      throw new HttpException('Artist is not found', HttpStatus.NOT_FOUND);
    return this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
      include: { albums: true },
    });
  }

  async remove(id: string) {
    const artist = await this.findOne(id);
    if (!artist)
      throw new HttpException('Artist is not found', HttpStatus.NOT_FOUND);
    return this.prisma.artist.delete({ where: { id } });
  }
}
