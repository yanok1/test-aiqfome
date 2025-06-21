import { IsNumber, IsPositive, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from 'class-sanitizer';

export class CreateFavoriteDto {
  @ApiProperty({
    example: 1,
    description: 'ID do produto na FakeStore API',
  })
  @IsNumber({}, { message: 'ID do produto deve ser um número' })
  @IsInt({ message: 'ID do produto deve ser um número inteiro' })
  @IsPositive({ message: 'ID do produto deve ser um número positivo' })
  @Trim()
  productId: number;
}
