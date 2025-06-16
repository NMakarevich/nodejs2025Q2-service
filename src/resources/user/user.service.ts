import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as process from 'node:process';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = Number(process.env.CRYPT_SALT || '10');
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    const newUser = await this.prisma.user.create({
      data: { ...createUserDto, password: hash },
      omit: {
        password: true,
      },
    });
    return transformDate(newUser);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      omit: {
        password: true,
      },
    });
    return users.map((user) => transformDate(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
      },
    });
    if (!user)
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    return transformDate(user);
  }

  async findOneByLogin(login: string) {
    return this.prisma.user.findFirst({ where: { login } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user)
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    const isValidPassword = await bcrypt.compare(
      updateUserDto.oldPassword,
      user.password,
    );
    if (!isValidPassword)
      throw new HttpException('Incorrect old password', HttpStatus.FORBIDDEN);

    const saltOrRounds = Number(process.env.CRYPT_SALT || '10');
    const hash = await bcrypt.hash(updateUserDto.newPassword, saltOrRounds);
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { password: hash, version: user.version + 1 },
      omit: {
        password: true,
      },
    });
    return transformDate(updatedUser);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user)
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    return this.prisma.user.delete({ where: { id } });
  }
}

function transformDate(user: {
  id: string;
  login: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...user,
    createdAt: user.createdAt.getTime(),
    updatedAt: user.updatedAt.getTime(),
  };
}
