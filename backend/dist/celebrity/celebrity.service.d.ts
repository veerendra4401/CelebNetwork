import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Celebrity } from './entities/celebrity.entity';
export declare class CelebrityService implements OnModuleInit {
    private celebrityRepository;
    private configService;
    private ai;
    constructor(celebrityRepository: Repository<Celebrity>, configService: ConfigService);
    onModuleInit(): Promise<void>;
    private seedSampleCelebrities;
    suggestCelebrities(description: string): Promise<any[]>;
    autoFillCelebrityDetails(name: string): Promise<Partial<Celebrity> | null>;
    private formatCelebrityDetails;
    create(createCelebrityDto: Partial<Celebrity>): Promise<Celebrity>;
    findAll(): Promise<Celebrity[]>;
    findOne(id: string): Promise<Celebrity | null>;
    update(id: string, updateCelebrityDto: Partial<Celebrity>): Promise<Celebrity | null>;
    remove(id: string): Promise<void>;
}
