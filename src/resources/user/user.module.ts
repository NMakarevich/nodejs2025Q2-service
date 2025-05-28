import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Database } from '../../db/database';

@Module({
  controllers: [UserController],
  providers: [UserService, Database],
})
export class UserModule {}
