import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const PRIVATE_KEY = configService.get('PRIVATE_KEY');
        console.log('PRIVATE_KEY');
        console.log(PRIVATE_KEY);
        return {
          secret: configService.get('PRIVATE_KEY'),
          signOptions: { expiresIn: '60m' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
