import {
    ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MoviesService } from 'src/movies/movies.service';

@Injectable()
export class EventsService {
  constructor(
      private readonly moviesService: MoviesService,
    private readonly prisma: PrismaService,
) {}

  async findAll() {
    return this.prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        movie: true,
        seats: true,
      },
      orderBy: {
        eventDate: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        movie: true,
        seats: {
          orderBy: [
            { row: 'asc' },
            { number: 'asc' },
          ],
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async create(data: {
  tmdbId: number;
  organizerId: string;
  title: string;
  description?: string;
  eventDate: string;
  venue: string;
  room: string;
  price: number;
  rows: string[];
  seatsPerRow: number;
}) {

  const organizer = await this.prisma.user.findUnique({
    where: {
      id: data.organizerId,
    },
  });

  if (!organizer || organizer.role !== 'ORGANIZER') {
    throw new ForbiddenException(
      'You do not have permission to perform this action.',
    );
  }

  let movie = await this.prisma.movie.findUnique({
    where: {
      tmdbId: data.tmdbId,
    },
  });

  if (!movie) {
    const tmdbMovie = await this.moviesService.findById(
      data.tmdbId,
    );

    movie = await this.prisma.movie.create({
      data: {
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        overview: tmdbMovie.overview,
        posterPath: tmdbMovie.poster_path,
        releaseDate: tmdbMovie.release_date
          ? new Date(tmdbMovie.release_date)
          : null,
      },
    });
  }

  const capacity =
    data.rows.length * data.seatsPerRow;

  return this.prisma.event.create({
    data: {
      movieId: movie.id,
      organizerId: data.organizerId,
      title: data.title,
      description: data.description,
      eventDate: new Date(data.eventDate),
      venue: data.venue,
      room: data.room,
      price: data.price,
      capacity,
      status: 'PUBLISHED',

      seats: {
        create: data.rows.flatMap((row) =>
          Array.from(
            { length: data.seatsPerRow },
            (_, index) => ({
              row,
              number: index + 1,
            })),
        ),
      },
    },

    include: {
      movie: true,
      seats: true,
    },
  });
}
}