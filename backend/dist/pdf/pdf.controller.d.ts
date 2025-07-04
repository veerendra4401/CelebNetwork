import { Response } from 'express';
import { PdfService } from './pdf.service';
export declare class PdfController {
    private readonly pdfService;
    constructor(pdfService: PdfService);
    generateCelebrityProfile(id: string, res: Response): Promise<void>;
}
