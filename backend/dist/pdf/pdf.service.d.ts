import { CelebrityService } from '../celebrity/celebrity.service';
export declare class PdfService {
    private readonly celebrityService;
    constructor(celebrityService: CelebrityService);
    generateProfilePdf(celebrityId: string): Promise<Buffer>;
    generatePdf(html: string): Promise<Buffer>;
}
