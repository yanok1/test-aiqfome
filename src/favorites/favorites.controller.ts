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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
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
  @ApiOperation({ summary: 'Adicionar produto aos favoritos' })
  @ApiResponse({
    status: 201,
    description: 'Produto adicionado aos favoritos',
    type: FavoriteResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Produto já está nos favoritos' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado na API' })
  create(@Request() req, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(req.user.userId, createFavoriteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar favoritos do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de favoritos',
    type: [FavoriteResponseDto],
  })
  findAll(@Request() req) {
    return this.favoritesService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar favorito por ID' })
  @ApiResponse({
    status: 200,
    description: 'Favorito encontrado',
    type: FavoriteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Favorito não encontrado' })
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.favoritesService.findOne(req.user.userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover favorito por ID' })
  @ApiResponse({ status: 200, description: 'Favorito removido' })
  @ApiResponse({ status: 404, description: 'Favorito não encontrado' })
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.favoritesService.remove(req.user.userId, id);
  }

  @Delete('product/:productId')
  @ApiOperation({ summary: 'Remover favorito por ID do produto' })
  @ApiResponse({ status: 200, description: 'Favorito removido' })
  @ApiResponse({ status: 404, description: 'Favorito não encontrado' })
  removeByProductId(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.favoritesService.removeByProductId(req.user.userId, productId);
  }
}
