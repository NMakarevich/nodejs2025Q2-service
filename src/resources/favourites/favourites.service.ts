import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavouritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getFavourites() {
    let favourites = await this.prisma.favourites.findFirst();
    if (!favourites)
      favourites = await this.prisma.favourites.create({
        data: { trackIds: [], artistIds: [], albumIds: [] },
      });
    return favourites;
  }

  async findAll() {
    const { artistIds, albumIds, trackIds } = await this.getFavourites();

    const artists = await Promise.all(
      artistIds.map((id) => this.prisma.artist.findUnique({ where: { id } })),
    );
    const albums = await Promise.all(
      albumIds.map((id) => this.prisma.album.findUnique({ where: { id } })),
    );

    const tracks = await Promise.all(
      trackIds.map((id) => this.prisma.track.findUnique({ where: { id } })),
    );

    return {
      artists: artists.filter((artist) => artist),
      albums: albums.filter((album) => album),
      tracks: tracks.filter((track) => track),
    };
  }

  async addTrack(id: string) {
    const favourites = await this.getFavourites();
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track)
      throw new HttpException(
        'Track is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    if (!favourites.trackIds.includes(id)) favourites.trackIds.push(id);
    const favouritesId = favourites.id;
    delete favourites.id;
    await this.prisma.favourites.update({
      where: { id: favouritesId },
      data: favourites,
    });
    return { message: 'Track is added to favourites' };
  }

  async removeTrack(id: string) {
    const favourites = await this.getFavourites();
    const trackIndex = favourites.trackIds.indexOf(id);
    if (trackIndex !== -1) favourites.trackIds.splice(trackIndex, 1);
    const favouritesId = favourites.id;
    delete favourites.id;
    await this.prisma.favourites.update({
      where: { id: favouritesId },
      data: favourites,
    });
    return { message: 'Track is removed from favourites' };
  }

  async addArtist(id: string) {
    const favourites = await this.getFavourites();
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist)
      throw new HttpException(
        'Artist is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    if (!favourites.artistIds.includes(id)) favourites.artistIds.push(id);
    const favouritesId = favourites.id;
    delete favourites.id;
    await this.prisma.favourites.update({
      where: { id: favouritesId },
      data: favourites,
    });
    return { message: 'Artist is added to favourites' };
  }

  async removeArtist(id: string) {
    const favourites = await this.getFavourites();
    const artistIndex = favourites.artistIds.indexOf(id);
    if (artistIndex !== -1) favourites.artistIds.splice(artistIndex, 1);
    const favouritesId = favourites.id;
    delete favourites.id;
    await this.prisma.favourites.update({
      where: { id: favouritesId },
      data: favourites,
    });
    return { message: 'Artist is removed from favourites' };
  }

  async addAlbum(id: string) {
    const favourites = await this.getFavourites();
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album)
      throw new HttpException(
        'Album is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    if (!favourites.albumIds.includes(id)) favourites.albumIds.push(id);
    const favouritesId = favourites.id;
    delete favourites.id;
    await this.prisma.favourites.update({
      where: { id: favouritesId },
      data: favourites,
    });
    return { message: 'Album is added to favourites' };
  }

  async removeAlbum(id: string) {
    const favourites = await this.getFavourites();
    const albumIndex = favourites.albumIds.indexOf(id);
    if (albumIndex !== -1) favourites.albumIds.splice(albumIndex, 1);
    const favouritesId = favourites.id;
    delete favourites.id;
    await this.prisma.favourites.update({
      where: { id: favouritesId },
      data: favourites,
    });
    return { message: 'Album is removed from favourites' };
  }
}
