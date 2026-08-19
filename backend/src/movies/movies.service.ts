import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {

  private readonly logger = new Logger(MoviesService.name);
  constructor(private readonly http: HttpService) {}

  async search(query: string) {
    try {
      const { data } = await firstValueFrom(
        this.http.get(
          `${process.env.TMDB_BASE_URL}/search/movie`,
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
              query,
              language: 'pt-PT',
            },
          },
        ),
      );

      return data.results;
    } catch (error: any) {

      // Exibe a resposta de erro do TMDb ou a mensagem da requisição
      this.logger.error(
        'TMDb Search Error:',
        error?.response?.data || error?.message || error,
      );


      throw new InternalServerErrorException(
        'Failed to fetch movies from TMDb',
      );
    }
  }

  async findById(tmdbId: number) {
    try {
      const { data } = await firstValueFrom(
        this.http.get(
          `${process.env.TMDB_BASE_URL}/movie/${tmdbId}`,
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
              language: 'pt-PT',
            },
          },
        ),
      );

      return data;
    } catch {
      throw new InternalServerErrorException(
        'Failed to fetch movie from TMDb',
      );
    }
  }
}