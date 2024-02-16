import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from 'src/users/users.entity';
import { TokenBlacklistService } from './token-blacklist.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: 'Shahnawaz@!@#',
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy, UsersService, TokenBlacklistService],
  exports: [AuthService],
})
export class JwtAuthModule {}
