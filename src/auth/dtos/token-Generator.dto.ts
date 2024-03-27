import { ArgsType, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/common.dto';

@ArgsType()
export class tokenGeneratorInput {
  @Field((type) => ID)
  userId: number;
}

@ObjectType()
export class tokenGeneratorOutput extends CoreOutputDto {
  @Field((type) => String, { nullable: true })
  token?: string;
}
