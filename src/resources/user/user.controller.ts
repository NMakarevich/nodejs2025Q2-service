import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpCode,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto): User {
    return this.userService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @HttpCode(200)
  findAll(): User[] {
    return this.userService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', new ParseUUIDPipe()) id: string): User {
    return this.userService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  @HttpCode(200)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): User {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }
}
