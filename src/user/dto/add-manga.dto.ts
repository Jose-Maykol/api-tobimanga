import { IsString } from 'class-validator'

export class AddMangaDto {
  @IsString()
  mangaId: string
}
