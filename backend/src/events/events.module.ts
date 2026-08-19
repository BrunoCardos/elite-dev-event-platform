import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [MoviesModule],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
