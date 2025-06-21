import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from '../entities/favorite.entity';
import { Repository } from 'typeorm';
import { FakeStoreService, FakeStoreProduct } from '../services/fakestore.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let repo: Repository<Favorite>;
  let fakeStoreService: FakeStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getRepositoryToken(Favorite),
          useClass: Repository,
        },
        {
          provide: FakeStoreService,
          useValue: {
            validateProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    repo = module.get<Repository<Favorite>>(getRepositoryToken(Favorite));
    fakeStoreService = module.get<FakeStoreService>(FakeStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if favorite already exists', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue({} as Favorite);
      await expect(
        service.create(1, { productId: 1 }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create and return a favorite', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);
      const fakeProduct: FakeStoreProduct = {
        id: 1,
        title: 'Product 1',
        price: 10,
        description: 'desc',
        category: 'cat',
        image: 'img',
        rating: { rate: 4, count: 10 },
      };
      (fakeStoreService.validateProduct as jest.Mock).mockResolvedValue(fakeProduct);
      jest.spyOn(repo, 'create').mockReturnValue({ ...fakeProduct, customerId: 1 } as any);
      jest.spyOn(repo, 'save').mockResolvedValue({ ...fakeProduct, customerId: 1 } as any);
      const result = await service.create(1, { productId: 1 });
      expect(result).toMatchObject({ id: 1, title: 'Product 1', customerId: 1 });
    });
  });

  describe('findAll', () => {
    it('should return all favorites for a customer', async () => {
      const favorites = [{ id: 1, customerId: 1 } as Favorite];
      jest.spyOn(repo, 'find').mockResolvedValue(favorites);
      const result = await service.findAll(1);
      expect(result).toEqual(favorites);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);
      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });
    it('should return the favorite if found', async () => {
      const favorite = { id: 1, customerId: 1 } as Favorite;
      jest.spyOn(repo, 'findOne').mockResolvedValue(favorite);
      const result = await service.findOne(1, 1);
      expect(result).toEqual(favorite);
    });
  });

  describe('remove', () => {
    it('should remove a favorite', async () => {
      const favorite = { id: 1, customerId: 1 } as Favorite;
      jest.spyOn(service, 'findOne').mockResolvedValue(favorite);
      jest.spyOn(repo, 'remove').mockResolvedValue(favorite);
      await expect(service.remove(1, 1)).resolves.toBeUndefined();
    });
  });
}); 