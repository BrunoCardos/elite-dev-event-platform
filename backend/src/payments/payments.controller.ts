import {
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post(':reservationId')
  pay(
    @Param('reservationId')
    reservationId: string,
  ) {
    return this.paymentsService.pay(
      reservationId,
    );
  }
}