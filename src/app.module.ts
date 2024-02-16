import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { MongooseConfigModule } from './mongoose/mongoose-config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from './users/users.entity';
import { LoggingMiddleWare } from './middleware/logging.middleware';
import { JwtAuthModule } from './auth/jwt.module';
import { AuthController } from './auth/auth.controller';
import { TokenBlacklistService } from './auth/token-blacklist.service';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { CleanupTaskService } from './services/cleanup-task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
    UsersModule,
    MongooseConfigModule,
    JwtAuthModule,
    ScheduleModule.forRoot(),
    UserModule, // Register the ScheduleModule
  ],
  controllers: [AppController, UsersController, AuthController],
  providers: [
    AppService,
    UsersService,
    TokenBlacklistService,
    CleanupTaskService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleWare).forRoutes('*');
  }
}
