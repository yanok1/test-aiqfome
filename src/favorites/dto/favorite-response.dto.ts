import { ApiProperty } from '@nestjs/swagger';

export class FavoriteResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  customerId: number;

  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({
    example: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
  })
  productTitle: string;

  @ApiProperty({
    example: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  })
  productImage: string;

  @ApiProperty({ example: 109.95 })
  productPrice: number;

  @ApiProperty({ example: { rate: 3.9, count: 120 } })
  productRating: { rate: number; count: number };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
