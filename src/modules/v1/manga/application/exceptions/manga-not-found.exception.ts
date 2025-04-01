import { NotFoundException } from "@nestjs/common";
import { error } from "console";


export class MangaNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'No se encontró el manga',
      error: 'MangaNotFoundException',
    })
  }
}