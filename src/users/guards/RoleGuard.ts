import { UserRole } from '../enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

const RoleGuard = (role: UserRole): Type<any> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();

      const user = request.user;
      return user?.userRole === role;
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
