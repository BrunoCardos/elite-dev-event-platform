import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ValidationsService } from './validations.service';

@Controller('tickets')
export class ValidationsController {
  constructor(
    private readonly validationsService: ValidationsService,
  ) {}

  @Post('validate')
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