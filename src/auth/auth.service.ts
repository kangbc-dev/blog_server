import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  tokenGeneratorInput,
  tokenGeneratorOutput,
} from './dtos/token-Generator.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly jwtService: JwtService) {}

  tokenGenerator(payload: number, type?: string): tokenGeneratorOutput {
    try {
      console.log('payload');
      console.log(payload);
      const token = this.jwtService.sign(
        { id: payload },
        { expiresIn: type === 'refresh' ? '1m' : '1h' },
      );
      if (!token) {
        throw new Error('토큰을 생성할 수 없습니다.');
      }
      return {
        ok: true,
        token,
      };
    } catch (e) {
      this.logger.error(
        `토큰 생성 중 에러가 발생했습니다: ${e.message}`,
        e.stack,
      );
      throw new Error(`토큰 생성 중 에러가 발생했습니다: ${e.message}`);
    }
  }

  async tokenVerifier(token: string) {
    try {
      const tokenCheck = await this.jwtService.verify(token); //iat = 발급시간, exp = 만료시간
      // console.log(new Date(tokenCheck.iat * 1000));
      // console.log(Date.now() > tokenCheck.iat);
      return tokenCheck;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
