import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { signInInput, signInOutput } from './dtos/sign-in.dto';
import { ExecutionContext, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';
import { signOutOutput } from './dtos/sign-out.dto';
import { checkTokenOutput } from './dtos/check-token.dto';
import { signUpInput, signUpOutput } from './dtos/sign-up.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation((returns) => signUpOutput)
  signUp(
    @Args('input') input: signUpInput,
    @Context() context: any,
  ): Promise<signUpOutput> {
    console.log('mutation => signUp activated');
    const res: Response = context.res;
    return this.userService.signUp(input, res);
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

  @Query((returns) => checkTokenOutput)
  checkToken(@Context() context: any): Promise<checkTokenOutput> {
    return this.userService.checkToken(context);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => signOutOutput)
  signOut(@Context() context: any): Promise<signOutOutput> {
    return this.userService.signOut(context);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => String)
  hello(): string {
    return 'hello';
  }
}
