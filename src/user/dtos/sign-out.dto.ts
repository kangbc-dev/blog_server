import { ObjectType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/common.dto';

@ObjectType()
export class signOutOutput extends CoreOutputDto {}
