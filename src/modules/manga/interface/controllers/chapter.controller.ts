import {
  Controller,
  Delete,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common'

import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'

@Controller(':mangaId/chapters')
export class ChapterController {
  constructor() {}
}
