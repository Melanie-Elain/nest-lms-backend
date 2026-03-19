import { Injectable, NotFoundException } from '@nestjs/common';
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
      select: ['id', 'email', 'password', 'fullName', 'role', 'isActive'] 
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return user;
  }

  // Hàm cập nhật thông tin người dùng (full_name và avatar)
  async updateProfile(userId: number, updateData: { full_name?: string; avatar?: string }) {
    const user = await this.usersRepository.preload({
      id: userId,
      ...updateData,
    });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return this.usersRepository.save(user);
  }

  // Hàm cập nhật trạng thái kích hoạt của người dùng (is_active)
  async updateStatus(id: number, isActive: boolean) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    
    user.isActive = isActive; // Cập nhật cột is_active
    return this.usersRepository.save(user);
  }

  // Hàm cập nhật thông tin người dùng (dùng chung cho cả update profile và change password)
  async update(id: number, updateData: Partial<User>) {
    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }
}