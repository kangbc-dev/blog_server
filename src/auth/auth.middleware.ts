import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class authMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('access_token' in req.headers && 'refresh_token' in req.headers) {
      try {
        const accessToken = req.headers['access_token'] as string,
          refreshToken = req.headers['refresh_token'] as string;
        const accessTokenResult =
          await this.authService.tokenVerifier(accessToken);
        if (!accessTokenResult) {
          const refreshTokenResult =
            await this.authService.tokenVerifier(refreshToken);
        }
        const result = await this.userService.findById({
          userId: accessTokenResult.id,
        });
        req['user'] = result.user;
      } catch (e) {
        console.log(e.message);
        throw new UnauthorizedException('토큰이 유효하지 않습니다.');
      }
    }
    next();
  }
}
