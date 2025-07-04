import { CelebrityService } from './celebrity.service';
import { Celebrity } from './entities/celebrity.entity';
export declare class CelebrityController {
    private readonly celebrityService;
    constructor(celebrityService: CelebrityService);
    suggestCelebrities(description: string): Promise<any[]>;
    autoFillCelebrityDetails(name: string): Promise<Partial<Celebrity> | null>;
    create(createCelebrityDto: Partial<Celebrity>): Promise<Celebrity>;
    findAll(): Promise<Celebrity[]>;
    findOne(id: string): Promise<Celebrity | null>;
    update(id: string, updateCelebrityDto: Partial<Celebrity>): Promise<Celebrity | null>;
    remove(id: string): Promise<void>;
    autoFillDetails(name: string): Promise<Partial<Celebrity> | null>;
}
