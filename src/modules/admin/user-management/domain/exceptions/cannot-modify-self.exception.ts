import { BaseException } from '@/common/exceptions/base.exception'

export class CannotModifySelfException extends BaseException {
  constructor() {
    super(
      'No puedes modificar tu propia cuenta desde el panel de administración',
      'CANNOT_MODIFY_SELF',
    )
  }
}
