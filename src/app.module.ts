import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import * as joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { authMiddleware } from './auth/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈화
      envFilePath: '.env.dev', //읽어올 .env 파일 경로
      ignoreEnvFile: process.env.NODE_ENV === 'prod', // 프로덕션 환경에서는 .env 파일을 무시
      validationSchema: joi.object({
        DB_HOST: joi.string().required(),
        DB_PORT: joi.string().required(),
        DB_USERNAME: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        DB_NAME: joi.string().required(),
        PRIVATE_KEY: joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true, //typeOrm이 db에 연결할 때 내 모듈의 현재 상태로 마이그레이션 한다는 의미(true일때)
      logging: process.env.NODE_ENV !== 'prod', //db조작시 콘솔에 표시해주는 기능
      entities: [User], //db 생성할 entity들의 배열
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true, //메모리에서 스키마 자동 생성
      driver: ApolloDriver,
      context: ({ req }) => ({ user: req['user'] }),
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
    }); //이 부분 떄문에, 미들웨어에서 토큰이 없을 때의 메소드 구분을 할 필요가 없음 POST가 아니면 애초에 토큰이 필요가 없기 때문
  }
}
