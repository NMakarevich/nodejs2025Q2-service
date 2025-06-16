import { IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateAlbumDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsPositive()
  year: number;

  @IsString()
  @IsOptional()
  artistId: string | null;
}
