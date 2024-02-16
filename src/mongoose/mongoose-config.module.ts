// src/mongoose/mongoose-config.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/nestbook')],
})
export class MongooseConfigModule {}
