import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/common.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class signInOutput extends CoreOutputDto {
  @Field((type) => String, { nullable: true })
  accessToken?: string;

  @Field((type) => String, { nullable: true })
  refreshToken?: string;
}

@InputType()
export class signInInput extends PickType(User, ['email', 'password']) {}
