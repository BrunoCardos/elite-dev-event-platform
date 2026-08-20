import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';

@ApiTags('Reservations')
@Controller()
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
  ) {}

  @Get('events/:eventId/seats')
  @ApiOperation({
    summary: 'Obter mapa de assentos de um evento',
  })
  @ApiParam({
    name: 'eventId',
    format: 'uuid',
    example:
      'b7e3c5c4-5c3f-4b1d-8c0a-123456789abc',
  })
  @ApiResponse({
    status: 200,
    description:
      'Evento e respetivos assentos.',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento não encontrado.',
  })
  getSeats(
    @Param('eventId') eventId: string,
  ) {
    return this.reservationsService.getEventSeats(
      eventId,
    );
  }

  @Post('reservations')
  @ApiOperation({
    summary: 'Criar reserva de assento',
    description:
      'Reserva um assento durante 10 minutos para permitir o pagamento.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          format: 'uuid',
          example:
            'd9f1bc03-1be3-452d-a374-63597a60cb92',
        },
        eventId: {
          type: 'string',
          format: 'uuid',
          example:
            'b7e3c5c4-5c3f-4b1d-8c0a-123456789abc',
        },
        seatId: {
          type: 'string',
          format: 'uuid',
          example:
            'c2d3e4f5-6789-1234-5678-123456789abc',
        },
      },
      required: [
        'userId',
        'eventId',
        'seatId',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Reserva criada.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Assento indisponível.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Evento ou assento não encontrado.',
  })
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
  @ApiOperation({
    summary: 'Listar reservas de um utilizador',
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
      'Lista de reservas do utilizador.',
  })
  findByUser(
    @Param('userId') userId: string,
  ) {
    return this.reservationsService.findByUser(
      userId,
    );
  }
}