import { CreateMangaDto } from './create-manga.dto'

export class UpdateMangaDto extends CreateMangaDto {}

//TODO: Ignorar chapters, no se deberia poder actualizarse desde aqui, daña la integridad
