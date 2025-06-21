import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import {
  FakeStoreService,
  FakeStoreProduct,
} from '../services/fakestore.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
    private readonly fakeStoreService: FakeStoreService,
  ) {}

  async create(
    customerId: number,
    createFavoriteDto: CreateFavoriteDto,
  ): Promise<Favorite> {
    // Verificar se já existe
    const exists = await this.favoriteRepo.findOne({
      where: {
        customerId,
        productId: createFavoriteDto.productId,
      },
    });

    if (exists) {
      throw new ConflictException('Produto já está nos favoritos');
    }

    // Validar produto na FakeStore API
    const product: FakeStoreProduct =
      await this.fakeStoreService.validateProduct(createFavoriteDto.productId);

    // Criar favorito
    const favorite = this.favoriteRepo.create({
      customerId,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      productPrice: product.price,
      productRating: product.rating,
    });

    return this.favoriteRepo.save(favorite);
  }

  async findAll(customerId: number): Promise<Favorite[]> {
    return this.favoriteRepo.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(customerId: number, favoriteId: number): Promise<Favorite> {
    const favorite = await this.favoriteRepo.findOne({
      where: { id: favoriteId, customerId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorito não encontrado');
    }

    return favorite;
  }

  async remove(customerId: number, favoriteId: number): Promise<void> {
    const favorite = await this.findOne(customerId, favoriteId);
    await this.favoriteRepo.remove(favorite);
  }

  async removeByProductId(
    customerId: number,
    productId: number,
  ): Promise<void> {
    const favorite = await this.favoriteRepo.findOne({
      where: { customerId, productId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorito não encontrado');
    }

    await this.favoriteRepo.remove(favorite);
  }
}
