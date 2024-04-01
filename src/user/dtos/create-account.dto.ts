import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/common.dto';
import { User } from '../entities/user.entity';
import { IsString } from 'class-validator';

@ObjectType()
export class createAccountOutput extends CoreOutputDto {}

@InputType()
export class createAccountInput extends PickType(User, ['email', 'password']) {
  @Field((type) => String)
  @IsString()
  nickname: string;
}
