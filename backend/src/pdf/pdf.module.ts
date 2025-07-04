import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { CelebrityModule } from '../celebrity/celebrity.module';

@Module({
  imports: [CelebrityModule],
  providers: [PdfService],
  controllers: [PdfController],
})
export class PdfModule {} 