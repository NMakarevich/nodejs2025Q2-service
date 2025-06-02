import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

import { userDB } from '../../db/database';

@Injectable()
export class UserService {
  private users = userDB;

  create(createUserDto: CreateUserDto) {
    const time = new Date().getTime();
    const user = new User({
      id: uuidv4(),
      ...createUserDto,
      version: 1,
      createdAt: time,
      updatedAt: time,
    });
    return this.users.create(user);
  }

  findAll() {
    return this.users.findAll();
  }

  findOne(id: string) {
    const user = this.users.findOne(id);
    if (!user)
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);
    if (!user)
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    if (user.password !== updateUserDto.oldPassword)
      throw new HttpException('Incorrect old password', HttpStatus.FORBIDDEN);

    return this.users.update(id, {
      password: updateUserDto.newPassword,
      version: user.version + 1,
      updatedAt: new Date().getTime(),
    });
  }

  remove(id: string) {
    const user = this.findOne(id);
    if (!user)
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    return this.users.delete(id);
  }
}
