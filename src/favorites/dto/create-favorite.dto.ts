import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({
    example: 1,
    description: 'ID do produto na FakeStore API',
  })
  @IsNumber()
  @IsPositive()
  productId: number;
} 