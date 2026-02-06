import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'; 
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, // Đây là "cánh tay" giúp Service thao tác với DB
  ) {}

  // Hàm xử lý đăng ký người dùng
  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword, // Lưu mật khẩu đã mã hóa
    });
    return await this.usersRepository.save(newUser);
  }

  // Hàm lấy danh sách tất cả người dùng (Để bạn check trên Swagger cho tiện)
  async findAll() {
    return await this.usersRepository.find();
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'fullName', 'role'] 
    });
  }

}