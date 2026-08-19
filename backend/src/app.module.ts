import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { EventsModule } from './events/events.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [PrismaModule, AuthModule, MoviesModule, EventsModule, ReservationsModule, PaymentsModule],
})
export class AppModule {}
