import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class authMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers);
    const token = req.headers['x-jwt'] as string;
    console.log('token');
    console.log(token);
    if ('x-jwt' in req.headers) {
      try {
        this.authService.tokenVerifier(token);
      } catch (e) {
        console.log(e.message);
        throw new UnauthorizedException('토큰이 유효하지 않습니다.');
      }
    }
    next();
  }
}
