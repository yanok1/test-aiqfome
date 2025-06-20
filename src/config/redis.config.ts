import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';

@Injectable()
export class RedisConfig implements RedisModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createRedisModuleOptions(): RedisModuleOptions {
    return {
      type: 'single',
      url: `redis://${this.configService.get(
        'REDIS_HOST',
        'localhost',
      )}:${this.configService.get('REDIS_PORT', 6379)}`,
    };
  }
}
