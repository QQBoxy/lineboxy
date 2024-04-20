import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  findAll() {
    return this.usersRepository.find();
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
