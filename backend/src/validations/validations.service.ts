import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ValidationsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async validate(
    qrToken: string,
    gatekeeperId: string,
  ) {
    const ticket =
      await this.prisma.ticket.findUnique({
        where: {
          qrToken,
        },
        include: {
          reservation: {
            include: {
              event: true,
              seat: true,
            },
          },
        },
      });

    if (!ticket) {
      throw new NotFoundException(
        'Invalid ticket',
      );
    }

    if (ticket.status !== 'ACTIVE') {
      return {
        valid: false,
        result: 'ALREADY_USED',
        message: 'Ticket is not active',
      };
    }

    const gatekeeper =
      await this.prisma.user.findUnique({
        where: {
          id: gatekeeperId,
        },
      });

    if (
      !gatekeeper ||
      gatekeeper.role !== 'GATEKEEPER'
    ) {
      throw new BadRequestException(
        'Invalid gatekeeper',
      );
    }

    await this.prisma.$transaction([
      this.prisma.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          status: 'USED',
          usedAt: new Date(),
        },
      }),

      this.prisma.ticketValidation.create({
        data: {
          ticketId: ticket.id,
          gatekeeperId,
          result: 'VALID',
        },
      }),
    ]);

    return {
      valid: true,
      result: 'VALID',
      ticket: {
        id: ticket.id,
        code: ticket.code,
        event: ticket.reservation.event.title,
        seat: `${ticket.reservation.seat.row}${ticket.reservation.seat.number}`,
      },
    };
  }
}