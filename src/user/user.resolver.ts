import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  createAccountInput,
  createAccountOutput,
} from './dtos/create-account.dto';
import { UserService } from './user.service';
import { signInInput, signInOutput } from './dtos/sign-in.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation((returns) => createAccountOutput)
  createAccount(
    @Args('input') input: createAccountInput,
  ): Promise<createAccountOutput> {
    return this.userService.createAccount(input);
  }

  @Query((returns) => signInOutput)
  signIn(@Args('input') input: signInInput): Promise<signInOutput> {
    return this.userService.signIn(input);
  }
}
