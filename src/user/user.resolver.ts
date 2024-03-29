import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  createAccountInput,
  createAccountOutput,
} from './dtos/create-account.dto';
import { UserService } from './user.service';
import { signInInput, signInOutput } from './dtos/sign-in.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation((returns) => createAccountOutput)
  createAccount(
    @Args('input') input: createAccountInput,
  ): Promise<createAccountOutput> {
    console.log('mutation => createAccount activated');
    return this.userService.createAccount(input);
  }

  @Query((returns) => signInOutput)
  signIn(
    @Args('input') input: signInInput,
    @Context() context: any,
  ): Promise<signInOutput> {
    console.log('query => signIn activated');
    const res: Response = context.res;
    return this.userService.signIn(input, res);
  }

  // @UseGuards(AuthGuard)
  @Query((returns) => String)
  hello(): string {
    return 'hello';
  }
}
