import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPositive()
  year: number;

  @IsString()
  @IsOptional()
  artistId: string | null;
}
