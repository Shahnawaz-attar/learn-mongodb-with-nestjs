import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import mongoose, { Model } from 'mongoose';
import { updateUserDto } from './dto/update-user.dto';
import { convertToObjectId } from 'src/common/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>,
  ) {}

  async create(userDto: CreateUserDto): Promise<UserEntity> {
    const existingEmail = await this.userModel
      .findOne({ email: userDto.email })
      .exec();

    if (existingEmail) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    return new this.userModel(userDto).save();
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userModel.find();
  }

  async findById(id: number): Promise<UserEntity | null> {
    const objectId = convertToObjectId(id);
    return await this.userModel.findById(objectId).exec();
  }

  async update(id: number, updateUserDto: updateUserDto): Promise<UserEntity> {
    const objectId = convertToObjectId(id);

    const existingUser = await this.userModel.findById(objectId);

    if (!existingUser) {
      throw new NotFoundException('User Not Found');
    }

    Object.assign(existingUser, updateUserDto);
    return await existingUser.save();
  }

  async delete(id: number): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(
      convertToObjectId(id),
    );

    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findByUsername(username: string): Promise<UserEntity | undefined> {
    return this.userModel.findOne({ username }).exec();
  }
}
