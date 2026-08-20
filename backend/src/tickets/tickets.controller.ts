import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
  ) {}

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Listar tickets de um utilizador',
    description:
      'Retorna todos os tickets pertencentes ao utilizador.',
  })
  @ApiParam({
    name: 'userId',
    format: 'uuid',
    example:
      'd9f1bc03-1be3-452d-a374-63597a60cb92',
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista de tickets do utilizador.',
  })
  findByUser(
    @Param('userId') userId: string,
  ) {
    return this.ticketsService.findByUser(
      userId,
    );
  }

  @Get(':id/qr')
  @ApiOperation({
    summary: 'Obter QR Code de um ticket',
    description:
      'Gera o QR Code correspondente ao ticket.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    example:
      'b7e3c5c4-5c3f-4b1d-8c0a-123456789abc',
  })
  @ApiResponse({
    status: 200,
    description:
      'QR Code do ticket.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Ticket não encontrado.',
  })
  getQr(
    @Param('id') id: string,
  ) {
    return this.ticketsService.getQr(id);
  }
}