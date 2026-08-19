import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByUser(userId: string) {
    return this.prisma.ticket.findMany({
      where: {
        reservation: {
          userId,
        },
      },
      include: {
        reservation: {
          include: {
            event: {
              include: {
                movie: true,
              },
            },
            seat: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getQr(ticketId: string) {
    const ticket =
      await this.prisma.ticket.findUnique({
        where: {
          id: ticketId,
        },
      });

    if (!ticket) {
      throw new NotFoundException(
        'Ticket not found',
      );
    }

    const qrCode = await QRCode.toDataURL(
      ticket.qrToken,
    );

    return {
      ticketId: ticket.id,
      code: ticket.code,
      qrToken: ticket.qrToken,
      qrCode,
    };
  }
}