import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';
import { Track } from '../../track/entities/track.entity';

export class Favourite {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavouriteInterface {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
