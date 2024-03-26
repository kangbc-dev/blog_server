import { Injectable } from '@nestjs/common';
import {
  createAccountInput,
  createAccountOutput,
} from './dtos/create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { signInInput, signInOutput } from './dtos/sign-in.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  /** 회원가입 (email: string, password: srting) */
  async createAccount(input: createAccountInput): Promise<createAccountOutput> {
    try {
      //이메일 검증
      const email = await this.user.findOne({ where: { email: input.email } });
      if (email) {
        return {
          ok: false,
          error: '이미 존재하는 이메일입니다.',
        };
      }
      const savedUser = await this.user.save(
        this.user.create({ email: input.email, password: input.password }),
      );
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
  async signIn(input: signInInput): Promise<signInOutput> {
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
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }
}
