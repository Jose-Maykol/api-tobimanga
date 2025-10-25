import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import {
  Controller,
  Delete,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common'

@Controller(':mangaId/chapters')
export class ChapterController {
  constructor() {}
}
