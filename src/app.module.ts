import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import * as joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

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
      entities: [], //db 생성할 entity들의 배열
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true, //메모리에서 스키마 자동 생성
      driver: ApolloDriver,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
