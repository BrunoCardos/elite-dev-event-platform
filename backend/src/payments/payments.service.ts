import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async pay(reservationId: string) {
    return this.prisma.$transaction(async (tx) => {
      const reservation =
        await tx.reservation.findUnique({
          where: {
            id: reservationId,
          },
        });

      if (!reservation) {
        throw new NotFoundException(
          'Reservation not found',
        );
      }

      if (reservation.status !== 'PENDING') {
        throw new BadRequestException(
          'Reservation is not pending',
        );
      }

      if (
        reservation.expiresAt &&
        reservation.expiresAt < new Date()
      ) {
        await tx.reservation.update({
          where: {
            id: reservationId,
          },
          data: {
            status: 'EXPIRED',
          },
        });

        throw new BadRequestException(
          'Reservation has expired',
        );
      }

      const transactionId =
        `TX-${randomUUID()}`;

      const payment =
        await tx.payment.create({
          data: {
            reservationId,
            amount: reservation.amount,
            status: 'APPROVED',
            transactionId,
          },
        });

      await tx.reservation.update({
        where: {
          id: reservationId,
        },
        data: {
          status: 'CONFIRMED',
        },
      });

      const ticket =
        await tx.ticket.create({
          data: {
            reservationId,
            code: `TKT-${randomUUID()}`,
            qrToken: randomUUID(),
            status: 'ACTIVE',
          },
        });

      return {
        payment,
        reservation: {
          ...reservation,
          status: 'CONFIRMED',
        },
        ticket,
      };
    });
  }
}