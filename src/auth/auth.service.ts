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

  tokenGenerator(payload: number): tokenGeneratorOutput {
    try {
      console.log('payload');
      console.log(payload);
      const token = this.jwtService.sign({ id: payload });
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

  tokenVerifier(token: string) {
    const tokenCheck = this.jwtService.verify(token); //iat = 발급시간, exp = 만료시간
    console.log('tokenCheck');
    // console.log(new Date(tokenCheck.iat * 1000));
    // console.log(Date.now() > tokenCheck.iat);
    return tokenCheck;
  }
}
