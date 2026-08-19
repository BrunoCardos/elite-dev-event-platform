import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [PrismaModule, AuthModule, MoviesModule, EventsModule],
})
export class AppModule {}
