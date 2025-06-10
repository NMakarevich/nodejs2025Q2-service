import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.prisma.user.create({
      data: createUserDto,
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user)
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    if (user.password !== updateUserDto.oldPassword)
      throw new HttpException('Incorrect old password', HttpStatus.FORBIDDEN);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { password: updateUserDto.newPassword, version: user.version + 1 },
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
