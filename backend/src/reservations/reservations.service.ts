import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getEventSeats(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
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

    return {
      eventId: event.id,
      title: event.title,
      price: event.price,
      seats: event.seats,
    };
  }

  async create(
    userId: string,
    eventId: string,
    seatId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      const seat = await tx.seat.findFirst({
        where: {
          id: seatId,
          eventId,
        },
      });

      if (!seat) {
        throw new NotFoundException(
          'Seat not found for this event',
        );
      }

      if (seat.status !== 'AVAILABLE') {
        throw new BadRequestException(
          'Seat is not available',
        );
      }

      // Verifica reservas existentes
      const existingReservation =
        await tx.reservation.findFirst({
          where: {
            seatId,
            eventId,
            status: {
              in: ['PENDING', 'CONFIRMED'],
            },
          },
        });


      if (existingReservation && existingReservation.expiresAt && existingReservation.expiresAt >= new Date()) {
        throw new BadRequestException(
          'Seat is already reserved',
        );
      }

      const reservation =
        await tx.reservation.create({
          data: {
            userId,
            eventId,
            seatId,
            amount: event.price,
            status: 'PENDING',

            // 10 minutos para pagamento
            expiresAt: new Date(
              Date.now() + 10 * 60 * 1000,
            ),
          },

          include: {
            event: true,
            seat: true,
          },
        });

      return reservation;
    });
  }

  async findByUser(userId: string) {
    return this.prisma.reservation.findMany({
      where: {
        userId,
      },
      include: {
        event: {
          include: {
            movie: true,
          },
        },
        seat: true,
        payment: true,
        ticket: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}