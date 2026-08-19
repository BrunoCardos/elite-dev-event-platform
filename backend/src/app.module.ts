import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { EventsModule } from './events/events.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PaymentsModule } from './payments/payments.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [PrismaModule, AuthModule, MoviesModule, EventsModule, ReservationsModule, PaymentsModule, TicketsModule],
})
export class AppModule {}
