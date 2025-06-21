import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim, Escape } from 'class-sanitizer';

export class LoginDto {
  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email do cliente',
  })
  @IsEmail({}, { message: 'Email deve ser um endereço válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @Trim()
  @Escape()
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do cliente',
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @Trim()
  password: string;
}
