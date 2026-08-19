import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  search(@Query('query') query: string) {
    return this.moviesService.search(query);
  }

  @Get(':tmdbId')
  findById(@Param('tmdbId') tmdbId: string) {
    return this.moviesService.findById(Number(tmdbId));
  }
}