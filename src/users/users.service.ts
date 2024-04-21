import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = new User();
    user.googleId = createUserDto.googleId;
    user.name = createUserDto.name;
    user.email = createUserDto?.email ?? '';
    user.picture = createUserDto?.picture ?? '';
    user.role = createUserDto?.role ?? '';
    return this.usersRepository.save(user);
  }

  async findAll(findUserDto: FindUserDto) {
    const [data, total] = await this.usersRepository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      skip: findUserDto.offset || 0,
      take: findUserDto.limit || 10,
    });
    return {
      data,
      total,
    };
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id: id });
  }

  findOneByGoogleId(googleId: string) {
    return this.usersRepository.findOneBy({ googleId: googleId });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = new User();
    user.picture = updateUserDto?.picture ?? '';
    user.updatedAt = new Date();
    await this.usersRepository.update({ id: id }, user);
    return this.usersRepository.findOneBy({ id: id });
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
