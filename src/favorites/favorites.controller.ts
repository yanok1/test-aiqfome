import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteResponseDto } from './dto/favorite-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar produto aos favoritos' })
  @ApiBody({ type: CreateFavoriteDto })
  @ApiResponse({
    status: 201,
    description: 'Produto adicionado aos favoritos',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            customerId: { type: 'number', example: 1 },
            productId: { type: 'number', example: 1 },
            productTitle: { type: 'string', example: 'Fjallraven - Foldsack No. 1 Backpack' },
            productImage: { type: 'string', example: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg' },
            productPrice: { type: 'number', example: 109.95 },
            productRating: {
              type: 'object',
              properties: {
                rate: { type: 'number', example: 3.9 },
                count: { type: 'number', example: 120 },
              },
            },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Produto já está nos favoritos',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado na FakeStore API',
  })
  create(@Request() req, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(req.user.userId, createFavoriteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar favoritos do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de favoritos',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              customerId: { type: 'number', example: 1 },
              productId: { type: 'number', example: 1 },
              productTitle: { type: 'string', example: 'Fjallraven - Foldsack No. 1 Backpack' },
              productImage: { type: 'string', example: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg' },
              productPrice: { type: 'number', example: 109.95 },
              productRating: {
                type: 'object',
                properties: {
                  rate: { type: 'number', example: 3.9 },
                  count: { type: 'number', example: 120 },
                },
              },
              createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
              updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            },
          },
        },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  findAll(@Request() req) {
    return this.favoritesService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar favorito por ID' })
  @ApiResponse({
    status: 200,
    description: 'Favorito encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            customerId: { type: 'number', example: 1 },
            productId: { type: 'number', example: 1 },
            productTitle: { type: 'string', example: 'Fjallraven - Foldsack No. 1 Backpack' },
            productImage: { type: 'string', example: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg' },
            productPrice: { type: 'number', example: 109.95 },
            productRating: {
              type: 'object',
              properties: {
                rate: { type: 'number', example: 3.9 },
                count: { type: 'number', example: 120 },
              },
            },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Favorito não encontrado',
  })
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.favoritesService.findOne(req.user.userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover favorito por ID' })
  @ApiResponse({
    status: 200,
    description: 'Favorito removido',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Favorito não encontrado',
  })
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.favoritesService.remove(req.user.userId, id);
  }

  @Delete('product/:productId')
  @ApiOperation({ summary: 'Remover favorito por ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Favorito removido',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Favorito não encontrado',
  })
  removeByProductId(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.favoritesService.removeByProductId(req.user.userId, productId);
  }
}
