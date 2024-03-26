import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query((returns) => String)
  helloWorld(): string {
    return 'hello world!';
  }
}
