import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Email zaten kayıtlı mı kontrol et
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Bu email adresi zaten kayıtlı!');
    }

    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  async findByEmail(email: string) { // Email'e göre kullanıcı bul (Login için gerekli)
    return await this.usersRepository.findOneBy({ email });
  }

  async findAll() { // Tüm kullanıcıları getir
    return await this.usersRepository.find({
      select: ['id', 'email', 'fullName', 'role'],
    });
  }

  async remove(id: number) { // Kullanıcı sil
    return await this.usersRepository.delete(id);
  }
}