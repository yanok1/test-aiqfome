import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const exists = await this.customerRepo.findOne({
      where: { email: createCustomerDto.email },
    });
    if (exists) {
      throw new ConflictException('Email já cadastrado');
    }

    const hash = await bcrypt.hash(createCustomerDto.password, 10);
    const customer = this.customerRepo.create({
      name: createCustomerDto.name,
      email: createCustomerDto.email,
    });
    (customer as any).password = hash;

    return this.customerRepo.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepo.find({
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepo.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    });
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return customer;
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const exists = await this.customerRepo.findOne({
        where: { email: updateCustomerDto.email },
      });
      if (exists) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    if (updateCustomerDto.password) {
      const hash = await bcrypt.hash(updateCustomerDto.password, 10);
      (customer as any).password = hash;
    }

    Object.assign(customer, updateCustomerDto);
    return this.customerRepo.save(customer);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepo.remove(customer);
  }
}
