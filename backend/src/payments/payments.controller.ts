import {
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post(':reservationId')
  @ApiOperation({
    summary: 'Pagar uma reserva',
    description:
      'Processa o pagamento da reserva, bloqueia o assento e gera automaticamente o ticket com QR Code.',
  })
  @ApiParam({
    name: 'reservationId',
    format: 'uuid',
    example:
      'b7e3c5c4-5c3f-4b1d-8c0a-123456789abc',
  })
  @ApiResponse({
    status: 201,
    description:
      'Pagamento aprovado e ticket criado.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Reserva expirada, já paga ou assento indisponível.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Reserva não encontrada.',
  })
  pay(
    @Param('reservationId')
    reservationId: string,
  ) {
    return this.paymentsService.pay(
      reservationId,
    );
  }
}