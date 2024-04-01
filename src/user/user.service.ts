import { Injectable, Res } from '@nestjs/common';
import {
  createAccountInput,
  createAccountOutput,
} from './dtos/create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { signInInput, signInOutput } from './dtos/sign-in.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { Response } from 'express';
import { signOutOutput } from './dtos/sign-out.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  /** 회원가입 (email: string, password: srting) */
  async createAccount(input: createAccountInput): Promise<createAccountOutput> {
    try {
      //이메일 검증
      const userExists = await this.user.findOne({
        where: { email: input.email },
      });
      if (userExists) {
        return {
          ok: false,
          error: '이미 존재하는 이메일입니다.',
        };
      }
      const newUser = this.user.create({
        email: input.email,
        password: input.password,
      });
      newUser.password = await newUser.hashPassword(input.password);
      const savedUser = await this.user.save(newUser);
      console.log(savedUser);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      throw new Error('계정을 생성할 수 없습니다.');
    }
  }

  /** 로그인 (email: string, password: srting) */
  async signIn(
    input: signInInput,
    @Res() res: Response,
  ): Promise<signInOutput> {
    try {
      const account = await this.user.findOne({
        where: {
          email: input.email,
        },
      });
      if (!account) {
        return {
          ok: false,
          error: '존재하지 않는 이메일입니다.',
        };
      }
      const passwordCheck = await account.checkPassword(input.password);
      if (!passwordCheck) {
        return {
          ok: false,
          error: '비밀번호가 일치하지 않습니다.',
        };
      }
      const { accessToken, refreshToken } = {
        accessToken: this.authService.tokenGenerator(account.id),
        refreshToken: this.authService.tokenGenerator(account.id, 'refresh'),
      };
      if (!accessToken.ok) {
        return {
          ok: false,
          error: '토큰을 생성할 수 없습니다.',
        };
      }

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async signOut(context): Promise<signOutOutput> {
    try {
      const res: Response = context.res; //타입 명시
      res.cookie('access_token', '', {
        httpOnly: true,
        expires: new Date(0),
      });
      res.cookie('refresh_token', '', {
        httpOnly: true,
        expires: new Date(0),
      });
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async findById({ userId }: UserProfileInput): Promise<UserProfileOutput> {
    if (!userId) return { ok: false, error: '사용자를 찾을 수 없습니다.' };
    try {
      console.log('userId');
      console.log(userId);
      const result = await this.user.findOne({ where: { id: userId } });
      console.log('findById result');
      console.log(result);
      if (!result) {
        return {
          ok: false,
          error: '',
        };
      }
      return {
        ok: true,
        user: result,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
