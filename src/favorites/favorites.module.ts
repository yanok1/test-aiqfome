import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { Favorite } from '../entities/favorite.entity';
import { FakeStoreService } from '../services/fakestore.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite])],
  controllers: [FavoritesController],
  providers: [FavoritesService, FakeStoreService],
  exports: [FavoritesService],
})
export class FavoritesModule {} 