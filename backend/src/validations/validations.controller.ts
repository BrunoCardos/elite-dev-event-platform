import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ValidationsService } from './validations.service';

@ApiTags('Gatekeeper')
@Controller('tickets')
export class ValidationsController {
  constructor(
    private readonly validationsService: ValidationsService,
  ) {}

  @Post('validate')
  @ApiOperation({
    summary: 'Validar ticket',
    description:
      'Valida o QR Token de um ticket na entrada do cinema e marca o ticket como utilizado.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        qrToken: {
          type: 'string',
          example:
            '550e8400-e29b-41d4-a716-446655440000',
          description:
            'Token obtido através do QR Code do ticket.',
        },
        gatekeeperId: {
          type: 'string',
          format: 'uuid',
          example:
            'd9f1bc03-1be3-452d-a374-63597a60cb92',
          description:
            'ID do utilizador responsável pela validação.',
        },
      },
      required: [
        'qrToken',
        'gatekeeperId',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Ticket validado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Gatekeeper inválido.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Ticket inválido.',
  })
  validate(
    @Body()
    body: {
      qrToken: string;
      gatekeeperId: string;
    },
  ) {
    return this.validationsService.validate(
      body.qrToken,
      body.gatekeeperId,
    );
  }
}