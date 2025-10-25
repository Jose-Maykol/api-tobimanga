import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import {
  Controller,
  Delete,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common'

@Controller('me/progress/chapters')
@UseGuards(JwtAuthGuard)
export class UserChapterProgressController {
  constructor() {}

  @Patch(':chapterId')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Param('chapterId') chapterId: string, @Request() request) {
    const user = request.user
  }

  @Delete(':chapterId')
  @UseGuards(JwtAuthGuard)
  async unmarkAsRead(
    @Param('chapterId') chapterId: string,
    @Request() request,
  ) {
    const user = request.user
  }
}
