import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPositive()
  duration: number;

  @IsUUID()
  @IsOptional()
  artistId: string | null;

  @IsUUID()
  @IsOptional()
  albumId: string | null;
}
