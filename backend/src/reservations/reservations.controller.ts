import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Controller()
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
  ) {}

  @Get('events/:eventId/seats')
  getSeats(
    @Param('eventId') eventId: string,
  ) {
    return this.reservationsService.getEventSeats(
      eventId,
    );
  }

  @Post('reservations')
  create(
    @Body()
    body: {
      userId: string;
      eventId: string;
      seatId: string;
    },
  ) {
    return this.reservationsService.create(
      body.userId,
      body.eventId,
      body.seatId,
    );
  }

  @Get('reservations/user/:userId')
  findByUser(
    @Param('userId') userId: string,
  ) {
    return this.reservationsService.findByUser(
      userId,
    );
  }
}