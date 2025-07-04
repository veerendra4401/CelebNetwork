"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CelebrityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const celebrity_entity_1 = require("./entities/celebrity.entity");
const genai_1 = require("@google/genai");
let CelebrityService = class CelebrityService {
    celebrityRepository;
    configService;
    ai;
    constructor(celebrityRepository, configService) {
        this.celebrityRepository = celebrityRepository;
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        console.log('Gemini API Key available:', !!apiKey);
        this.ai = new genai_1.GoogleGenAI({ apiKey: apiKey || '' });
    }
    async onModuleInit() {
        const count = await this.celebrityRepository.count();
        if (count === 0) {
            await this.seedSampleCelebrities();
        }
    }
    async seedSampleCelebrities() {
        const celebrities = [
            {
                name: 'Diljit Dosanjh',
                category: celebrity_entity_1.CelebrityCategory.SINGER,
                country: 'India',
                description: 'Punjabi singer and actor who performed at Coachella 2024. Known for his energetic performances and fusion of Punjabi music with modern beats.',
                fanbase: 15000000,
                instagramUrl: 'https://instagram.com/diljitdosanjh',
                genres: ['Punjabi Pop', 'Bhangra'],
                socialStats: {
                    instagram: 15200000,
                    youtube: 8500000,
                    spotify: 5000000
                }
            },
            {
                name: 'Taylor Swift',
                category: celebrity_entity_1.CelebrityCategory.SINGER,
                country: 'USA',
                description: 'American singer-songwriter known for hits like "Shake It Off" and "Anti-Hero". Multiple Grammy award winner.',
                fanbase: 200000000,
                instagramUrl: 'https://instagram.com/taylorswift',
                genres: ['Pop', 'Country', 'Folk'],
                socialStats: {
                    instagram: 272000000,
                    youtube: 51000000,
                    spotify: 100000000
                }
            },
            {
                name: 'Daniel Craig',
                category: celebrity_entity_1.CelebrityCategory.ACTOR,
                country: 'UK',
                description: 'British actor famous for playing James Bond in five films from Casino Royale to No Time to Die.',
                fanbase: 50000000,
                instagramUrl: 'https://instagram.com/danielcraig',
                genres: ['Action', 'Drama'],
                socialStats: {
                    instagram: 0,
                    imdb: 1000000
                }
            }
        ];
        for (const celebrity of celebrities) {
            const exists = await this.celebrityRepository.findOne({
                where: { name: celebrity.name }
            });
            if (!exists) {
                await this.celebrityRepository.save(celebrity);
            }
        }
        console.log('Sample celebrities seeded successfully');
    }
    async suggestCelebrities(description) {
        try {
            if (!this.ai) {
                console.error('Gemini API client is not configured');
                throw new Error('Search service is not properly configured');
            }
            console.log('Starting celebrity search with description:', description);
            const prompt = `Given this description: "${description}", suggest 5 potential celebrity matches. Format the response as a JSON array with name, category, country, and brief description. Example: [{"name": "Diljit Dosanjh", "category": "Singer", "country": "India", "description": "Punjabi singer and actor who performed at Coachella"}]. Only respond with the JSON array, no other text.`;
            const result = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            const content = result.text;
            console.log('Raw text content:', content);
            if (!content) {
                console.error('Gemini API returned empty content');
                return [];
            }
            try {
                const jsonContent = content.replace(/```json\n?|\n?```/g, '').trim();
                console.log('Cleaned JSON content:', jsonContent);
                let parsedContent;
                try {
                    parsedContent = JSON.parse(jsonContent);
                }
                catch (jsonError) {
                    console.error('JSON parse error:', jsonError);
                    const jsonMatch = jsonContent.match(/\[.*\]/s);
                    if (jsonMatch) {
                        console.log('Found JSON array in text:', jsonMatch[0]);
                        parsedContent = JSON.parse(jsonMatch[0]);
                    }
                    else {
                        throw jsonError;
                    }
                }
                console.log('Successfully parsed Gemini response:', parsedContent);
                const celebrities = Array.isArray(parsedContent) ? parsedContent : [];
                if (!Array.isArray(celebrities)) {
                    console.error('Parsed content is not an array:', celebrities);
                    throw new Error('Invalid response format from AI');
                }
                const validatedCelebrities = [];
                for (const celeb of celebrities) {
                    const name = celeb.name || 'Unknown';
                    const category = celeb.category || 'Unknown';
                    const country = celeb.country || 'Unknown';
                    const description = celeb.description || 'No description available';
                    let dbCelebrity = await this.celebrityRepository.findOne({
                        where: { name },
                    });
                    if (!dbCelebrity) {
                        dbCelebrity = await this.celebrityRepository
                            .createQueryBuilder('celebrity')
                            .where('LOWER(celebrity.name) = LOWER(:name)', { name })
                            .getOne();
                    }
                    validatedCelebrities.push({
                        id: dbCelebrity ? dbCelebrity.id : undefined,
                        name,
                        category,
                        country,
                        description,
                    });
                }
                return validatedCelebrities;
            }
            catch (parseError) {
                console.error('Failed to parse Gemini response:', parseError);
                console.error('Raw content that failed to parse:', content);
                throw new Error('Failed to parse AI response');
            }
        }
        catch (error) {
            console.error('Celebrity search error:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to search celebrities');
        }
    }
    async autoFillCelebrityDetails(name) {
        try {
            if (!this.ai) {
                console.error('Gemini API client is not configured');
                return null;
            }
            const prompt = `Create a detailed profile for ${name} including:\n- Full name\n- Category (Singer/Speaker/Actor)\n- Country\n- Instagram handle\n- Approximate fanbase size\n- Genre/specialties\n- Recent performances/appearances\nFormat as JSON.`;
            const result = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            const content = result.text;
            if (!content) {
                return null;
            }
            const details = JSON.parse(content.trim());
            return this.formatCelebrityDetails(details);
        }
        catch (error) {
            console.error('Gemini API Error:', error);
            return null;
        }
    }
    formatCelebrityDetails(details) {
        return {
            name: details.name,
            category: details.category,
            country: details.country,
            instagramUrl: `https://instagram.com/${details.instagram}`,
            fanbase: details.fanbase || 1000,
            genres: details.genres || [],
            setlist: details.setlist || [],
            socialStats: details.socialStats || {},
            recentPerformances: details.recentPerformances || [],
            description: details.description,
        };
    }
    async create(createCelebrityDto) {
        const celebrity = this.celebrityRepository.create(createCelebrityDto);
        return this.celebrityRepository.save(celebrity);
    }
    async findAll() {
        return this.celebrityRepository.find();
    }
    async findOne(id) {
        return this.celebrityRepository.findOne({ where: { id } });
    }
    async update(id, updateCelebrityDto) {
        await this.celebrityRepository.update(id, updateCelebrityDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.celebrityRepository.delete(id);
    }
};
exports.CelebrityService = CelebrityService;
exports.CelebrityService = CelebrityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(celebrity_entity_1.Celebrity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], CelebrityService);
//# sourceMappingURL=celebrity.service.js.map