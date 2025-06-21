import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim, Escape } from 'class-sanitizer';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do cliente',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, {
    message: 'Nome deve conter apenas letras e espaços',
  })
  @Trim()
  @Escape()
  name: string;

  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email único do cliente',
  })
  @IsEmail({}, { message: 'Email deve ser um endereço válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @MaxLength(255, { message: 'Email deve ter no máximo 255 caracteres' })
  @Trim()
  @Escape()
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do cliente (mínimo 6 caracteres)',
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @MaxLength(100, { message: 'Senha deve ter no máximo 100 caracteres' })
  @Trim()
  password: string;
}
