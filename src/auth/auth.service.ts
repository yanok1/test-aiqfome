import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const exists = await this.customerRepo.findOne({ where: { email } });
    if (exists) throw new ConflictException('E-mail já cadastrado');
    const hash = await bcrypt.hash(password, 10);
    const customer = this.customerRepo.create({ name, email });
    (customer as any).password = hash;
    await this.customerRepo.save(customer);
    return this.login(email, password);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Customer | null> {
    const customer = await this.customerRepo.findOne({ where: { email } });
    if (!customer || !(customer as any).password) return null;
    const valid = await bcrypt.compare(password, (customer as any).password);
    return valid ? customer : null;
  }

  async login(email: string, password: string) {
    const customer = await this.customerRepo.findOne({ where: { email } });
    if (!customer || !(customer as any).password)
      throw new UnauthorizedException('Credenciais inválidas');
    const valid = await bcrypt.compare(password, (customer as any).password);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');
    const payload = { sub: customer.id, email: customer.email };
    return {
      access_token: this.jwtService.sign(payload),
      customer: { id: customer.id, name: customer.name, email: customer.email },
    };
  }
}
