import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
  ) {}

  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
  ) {
    return this.ticketsService.findByUser(
      userId,
    );
  }

  @Get(':id/qr')
  getQr(
    @Param('id') id: string,
  ) {
    return this.ticketsService.getQr(id);
  }
}