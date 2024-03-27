import { ArgsType, Field, ID, ObjectType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/common.dto';
import { User } from '../entities/user.entity';

@ArgsType()
export class UserProfileInput {
  @Field((type) => ID)
  userId: number;
}

@ObjectType()
export class UserProfileOutput extends CoreOutputDto {
  @Field((type) => User, { nullable: true })
  user?: User;
}
