import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('pdf')
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('celebrity/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate PDF profile for a celebrity' })
  @ApiResponse({ status: 200, description: 'Returns PDF file' })
  async generateCelebrityProfile(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.pdfService.generateProfilePdf(id);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="celebrity-${id}.pdf"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
} 