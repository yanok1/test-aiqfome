import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

@Injectable()
export class FakeStoreService {
  private readonly baseUrl = 'https://fakestoreapi.com';

  async getProduct(productId: number): Promise<FakeStoreProduct> {
    try {
      const response = await axios.get<FakeStoreProduct>(
        `${this.baseUrl}/products/${productId}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new HttpException(
          'Produto não encontrado na FakeStore API',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        'Erro ao consultar FakeStore API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllProducts(): Promise<FakeStoreProduct[]> {
    try {
      const response = await axios.get<FakeStoreProduct[]>(
        `${this.baseUrl}/products`,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao consultar FakeStore API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateProduct(productId: number): Promise<FakeStoreProduct> {
    return this.getProduct(productId);
  }
} 