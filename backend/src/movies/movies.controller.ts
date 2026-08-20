import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
  ) {}

  @Get('search')
  @ApiOperation({
    summary: 'Pesquisar filmes',
    description:
      'Pesquisa filmes através da API do TMDb.',
  })
  @ApiQuery({
    name: 'query',
    required: true,
    example: 'Batman',
    description: 'Nome ou termo de pesquisa.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de filmes encontrados.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Erro ao comunicar com o TMDb.',
  })
  search(
    @Query('query') query: string,
  ) {
    return this.moviesService.search(query);
  }

  @Get(':tmdbId')
  @ApiOperation({
    summary: 'Obter filme pelo ID do TMDb',
  })
  @ApiParam({
    name: 'tmdbId',
    example: 414906,
    description: 'ID do filme no TMDb.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do filme.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Erro ao comunicar com o TMDb.',
  })
  findById(
    @Param('tmdbId') tmdbId: string,
  ) {
    return this.moviesService.findById(
      Number(tmdbId),
    );
  }
}