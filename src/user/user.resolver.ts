import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  createAccountInput,
  createAccountOutput,
} from './dtos/create-account.dto';
import { UserService } from './user.service';
import { signInInput, signInOutput } from './dtos/sign-in.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

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
  signIn(@Args('input') input: signInInput): Promise<signInOutput> {
    console.log('query => signIn activated');
    return this.userService.signIn(input);
  }

  @UseGuards(AuthGuard) 
  @Query((returns) => String)
  hello(): string {
    return 'hello';
  }
}
