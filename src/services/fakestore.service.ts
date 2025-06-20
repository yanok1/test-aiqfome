import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import axios, { AxiosError } from 'axios';

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
  private readonly logger = new Logger(FakeStoreService.name);
  private readonly cacheTtl = 3600; // 1 hour in seconds

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async getProduct(productId: number): Promise<FakeStoreProduct> {
    const cacheKey = `product:${productId}`;

    try {
      // Try to get from cache first
      const cachedProduct = await this.redis.get(cacheKey);
      if (cachedProduct) {
        this.logger.debug(`Product ${productId} found in cache`);
        return JSON.parse(cachedProduct);
      }

      // Fetch from API
      this.logger.debug(`Fetching product ${productId} from FakeStore API`);
      const response = await axios.get<FakeStoreProduct>(
        `${this.baseUrl}/products/${productId}`,
        {
          timeout: 10000, // 10 seconds timeout
        },
      );

      const product = response.data;

      // Cache the product
      await this.redis.setex(cacheKey, this.cacheTtl, JSON.stringify(product));

      this.logger.debug(`Product ${productId} cached successfully`);
      return product;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 404) {
          this.logger.warn(`Product ${productId} not found in FakeStore API`);
          throw new HttpException(
            'Produto não encontrado na FakeStore API',
            HttpStatus.NOT_FOUND,
          );
        }

        if (axiosError.code === 'ECONNABORTED') {
          this.logger.error(
            `Timeout fetching product ${productId} from FakeStore API`,
          );
          throw new HttpException(
            'Timeout ao consultar FakeStore API',
            HttpStatus.REQUEST_TIMEOUT,
          );
        }

        this.logger.error(
          `Error fetching product ${productId} from FakeStore API: ${axiosError.message}`,
        );
        throw new HttpException(
          'Erro ao consultar FakeStore API',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.error(
        `Unexpected error fetching product ${productId}: ${error.message}`,
      );
      throw new HttpException(
        'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllProducts(): Promise<FakeStoreProduct[]> {
    const cacheKey = 'products:all';

    try {
      // Try to get from cache first
      const cachedProducts = await this.redis.get(cacheKey);
      if (cachedProducts) {
        this.logger.debug('All products found in cache');
        return JSON.parse(cachedProducts);
      }

      // Fetch from API
      this.logger.debug('Fetching all products from FakeStore API');
      const response = await axios.get<FakeStoreProduct[]>(
        `${this.baseUrl}/products`,
        {
          timeout: 15000, // 15 seconds timeout for all products
        },
      );

      const products = response.data;

      // Cache the products
      await this.redis.setex(cacheKey, this.cacheTtl, JSON.stringify(products));

      this.logger.debug('All products cached successfully');
      return products;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.code === 'ECONNABORTED') {
          this.logger.error('Timeout fetching all products from FakeStore API');
          throw new HttpException(
            'Timeout ao consultar FakeStore API',
            HttpStatus.REQUEST_TIMEOUT,
          );
        }

        this.logger.error(
          `Error fetching all products from FakeStore API: ${axiosError.message}`,
        );
        throw new HttpException(
          'Erro ao consultar FakeStore API',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.error(
        `Unexpected error fetching all products: ${error.message}`,
      );
      throw new HttpException(
        'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateProduct(productId: number): Promise<FakeStoreProduct> {
    try {
      const product = await this.getProduct(productId);

      // Additional validation if needed
      if (!product.id || !product.title || product.price < 0) {
        this.logger.warn(`Product ${productId} has invalid data`);
        throw new HttpException(
          'Dados do produto inválidos',
          HttpStatus.BAD_REQUEST,
        );
      }

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Error validating product ${productId}: ${error.message}`,
      );
      throw new HttpException(
        'Erro ao validar produto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchProducts(query: string): Promise<FakeStoreProduct[]> {
    const cacheKey = `products:search:${query.toLowerCase()}`;

    try {
      // Try to get from cache first
      const cachedProducts = await this.redis.get(cacheKey);
      if (cachedProducts) {
        this.logger.debug(`Search results for "${query}" found in cache`);
        return JSON.parse(cachedProducts);
      }

      // Get all products and filter locally (FakeStore doesn't have search endpoint)
      const allProducts = await this.getAllProducts();
      const filteredProducts = allProducts.filter(
        product =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()),
      );

      // Cache the search results
      await this.redis.setex(
        cacheKey,
        this.cacheTtl,
        JSON.stringify(filteredProducts),
      );

      this.logger.debug(`Search results for "${query}" cached successfully`);
      return filteredProducts;
    } catch (error) {
      this.logger.error(
        `Error searching products with query "${query}": ${error.message}`,
      );
      throw new HttpException(
        'Erro ao buscar produtos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async clearCache(): Promise<void> {
    try {
      const keys = await this.redis.keys('product:*');
      const searchKeys = await this.redis.keys('products:search:*');
      const allKeys = [...keys, ...searchKeys, 'products:all'];

      if (allKeys.length > 0) {
        await this.redis.del(...allKeys);
        this.logger.debug(`Cleared ${allKeys.length} cache entries`);
      }
    } catch (error) {
      this.logger.error(`Error clearing cache: ${error.message}`);
      throw new HttpException(
        'Erro ao limpar cache',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
