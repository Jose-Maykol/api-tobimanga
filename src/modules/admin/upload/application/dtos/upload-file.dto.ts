import { IsEnum, IsNotEmpty } from 'class-validator'

export enum EntityType {
  MANGA = 'manga',
}

export class UploadFileDto {
  @IsNotEmpty({
    message: 'El campo "entityType" es obligatorio y no puede estar vacío.',
  })
  @IsEnum(EntityType, {
    message: 'El campo "entityType" solo puede tener el valor: "manga".',
  })
  entityType: EntityType
}
