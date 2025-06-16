import { IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsPositive()
  duration: number;

  @IsUUID()
  @IsOptional()
  artistId: string | null;

  @IsUUID()
  @IsOptional()
  albumId: string | null;
}
