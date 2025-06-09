import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavouritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    let favourites = await this.prisma.favourites.findFirst();
    if (!favourites)
      favourites = await this.prisma.favourites.create({
        data: { trackIds: [], artistIds: [], albumIds: [] },
      });
    return favourites;
    // const favs = this.favsDB.findAll();
    // const response: FavouriteInterface = {
    //   artists: favs.artists
    //     .map((id) => {
    //       try {
    //         return this.artistService.findOne(id);
    //       } catch {
    //         this.favsDB.deleteArtist(id);
    //       }
    //     })
    //     .filter((artist) => artist),
    //   albums: favs.albums
    //     .map((id) => {
    //       try {
    //         return this.albumService.findOne(id);
    //       } catch {
    //         this.favsDB.deleteAlbum(id);
    //       }
    //     })
    //     .filter((album) => album),
    //   tracks: favs.tracks
    //     .map((id) => {
    //       try {
    //         return this.trackService.findOne(id);
    //       } catch {
    //         this.favsDB.deleteTrack(id);
    //       }
    //     })
    //     .filter((track) => track),
    // };
    // return response;
  }

  async addTrack(id: string) {
    const favourites = await this.prisma.favourites.findFirst();
    if (!favourites.trackIds.includes(id)) favourites.trackIds.push(id);
    console.log(favourites);
    const favouritesId = favourites.id;
    delete favourites.id;
    await this.prisma.favourites.update({
      where: { id: favouritesId },
      data: favourites,
    });
    return { message: 'Track is added to favourites' };
  }

  async removeTrack(id: string) {
    const favourites = await this.prisma.favourites.findFirst();
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
    const favourites = await this.prisma.favourites.findFirst();
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
    const favourites = await this.prisma.favourites.findFirst();
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
    const favourites = await this.prisma.favourites.findFirst();
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
    const favourites = await this.prisma.favourites.findFirst();
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
