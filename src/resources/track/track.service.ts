import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTrackDto: CreateTrackDto) {
    return this.prisma.track.create({
      data: createTrackDto,
      include: {
        album: true,
        artist: true,
      },
    });
  }

  async findAll() {
    return this.prisma.track.findMany({
      include: {
        album: true,
        artist: true,
      },
    });
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      include: {
        album: true,
        artist: true,
      },
    });
    if (!track)
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.findOne(id);
    if (!track)
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    return this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
      include: {
        album: true,
        artist: true,
      },
    });
  }

  async remove(id: string) {
    const track = await this.findOne(id);
    if (!track)
      throw new HttpException('Track is not found', HttpStatus.NOT_FOUND);
    return this.prisma.track.delete({
      where: {
        id,
      },
    });
  }
}
