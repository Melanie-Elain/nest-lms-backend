import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'; // Đường dẫn tới file entity bạn tạo lúc nãy
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, // Đây là "cánh tay" giúp Service thao tác với DB
  ) {}

  // Hàm xử lý đăng ký người dùng
  async create(createUserDto: CreateUserDto) {
    // 1. Tạo một thực thể người dùng mới từ dữ liệu DTO
    const newUser = this.usersRepository.create(createUserDto);

    // 2. Lưu thực thể này vào Database
    // await giúp đợi lệnh lưu xong mới chạy tiếp
    return await this.usersRepository.save(newUser);
  }

  // Hàm lấy danh sách tất cả người dùng (Để bạn check trên Swagger cho tiện)
  async findAll() {
    return await this.usersRepository.find();
  }
}