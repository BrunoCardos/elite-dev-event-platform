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
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar eventos publicados',
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna todos os eventos publicados, incluindo filme e mapa de assentos.',
  })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter evento pelo ID',
  })
  @ApiParam({
    name: 'id',
    example:
      'b7e3c5c4-5c3f-4b1d-8c0a-123456789abc',
    description: 'ID do evento.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Evento encontrado com os seus assentos.',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento não encontrado.',
  })
  findOne(
    @Param('id') id: string,
  ) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar evento de cinema',
    description:
      'Cria um evento e gera automaticamente o mapa de assentos. Caso o filme ainda não exista na base de dados, é obtido através do TMDb.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tmdbId: {
          type: 'number',
          example: 414906,
          description: 'ID do filme no TMDb.',
        },
        organizerId: {
          type: 'string',
          format: 'uuid',
          example:
            'd9f1bc03-1be3-452d-a374-63597a60cb92',
        },
        title: {
          type: 'string',
          example:
            'Batman - Special Screening',
        },
        description: {
          type: 'string',
          example: 'Sessão especial',
        },
        eventDate: {
          type: 'string',
          format: 'date-time',
          example:
            '2026-08-25T20:00:00.000Z',
        },
        venue: {
          type: 'string',
          example: 'Elite Cinema',
        },
        room: {
          type: 'string',
          example: 'Sala 2',
        },
        price: {
          type: 'number',
          example: 15,
        },
        rows: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: [
            'A',
            'B',
            'C',
            'D',
            'E',
          ],
        },
        seatsPerRow: {
          type: 'number',
          example: 10,
        },
      },
      required: [
        'tmdbId',
        'organizerId',
        'title',
        'eventDate',
        'venue',
        'room',
        'price',
        'rows',
        'seatsPerRow',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Evento criado com sucesso.',
  })
  @ApiResponse({
    status: 403,
    description:
      'O utilizador não é um organizador.',
  })
  create(@Body() body: any) {
    return this.eventsService.create(body);
  }
}