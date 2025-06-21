import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseConfig } from './config/database.config';
import { RedisConfig } from './config/redis.config';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    RedisModule.forRootAsync({
      useClass: RedisConfig,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 100,
          ttl: 60,
        },
      ],
    }),
    AuthModule,
    CustomersModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
