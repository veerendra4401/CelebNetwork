import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Celebrity, CelebrityCategory } from './entities/celebrity.entity';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class CelebrityService implements OnModuleInit {
  private ai: GoogleGenAI;

  constructor(
    @InjectRepository(Celebrity)
    private celebrityRepository: Repository<Celebrity>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get('GEMINI_API_KEY');
    console.log('Gemini API Key available:', !!apiKey);
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async onModuleInit() {
    // Check if we already have celebrities
    const count = await this.celebrityRepository.count();
    if (count === 0) {
      await this.seedSampleCelebrities();
    }
  }

  private async seedSampleCelebrities() {
    const celebrities = [
      {
        name: 'Diljit Dosanjh',
        category: CelebrityCategory.SINGER,
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
        category: CelebrityCategory.SINGER,
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
        category: CelebrityCategory.ACTOR,
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

  async suggestCelebrities(description: string): Promise<any[]> {
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
        // Remove any markdown formatting if present
        const jsonContent = content.replace(/```json\n?|\n?```/g, '').trim();
        console.log('Cleaned JSON content:', jsonContent);

        let parsedContent;
        try {
          parsedContent = JSON.parse(jsonContent);
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          // Try to extract JSON array if wrapped in text
          const jsonMatch = jsonContent.match(/\[.*\]/s);
          if (jsonMatch) {
            console.log('Found JSON array in text:', jsonMatch[0]);
            parsedContent = JSON.parse(jsonMatch[0]);
          } else {
            throw jsonError;
          }
        }

        console.log('Successfully parsed Gemini response:', parsedContent);

        // Ensure we have an array
        const celebrities = Array.isArray(parsedContent) ? parsedContent : [];

        if (!Array.isArray(celebrities)) {
          console.error('Parsed content is not an array:', celebrities);
          throw new Error('Invalid response format from AI');
        }

        // Validate and enrich each celebrity object with DB id if exists
        const validatedCelebrities = [];
        for (const celeb of celebrities) {
          const name = celeb.name || 'Unknown';
          const category = celeb.category || 'Unknown';
          const country = celeb.country || 'Unknown';
          const description = celeb.description || 'No description available';

          // Try to find celebrity in DB by name (case-insensitive)
          let dbCelebrity = await this.celebrityRepository.findOne({
            where: { name },
          });
          // If not found, try case-insensitive search
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
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError);
        console.error('Raw content that failed to parse:', content);
        throw new Error('Failed to parse AI response');
      }
    } catch (error) {
      console.error('Celebrity search error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to search celebrities');
    }
  }

  async autoFillCelebrityDetails(name: string): Promise<Partial<Celebrity> | null> {
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
    } catch (error) {
      console.error('Gemini API Error:', error);
      return null;
    }
  }

  private formatCelebrityDetails(details: any): Partial<Celebrity> {
    return {
      name: details.name,
      category: details.category as CelebrityCategory,
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

  async create(createCelebrityDto: Partial<Celebrity>): Promise<Celebrity> {
    const celebrity = this.celebrityRepository.create(createCelebrityDto);
    return this.celebrityRepository.save(celebrity);
  }

  async findAll(): Promise<Celebrity[]> {
    return this.celebrityRepository.find();
  }

  async findOne(id: string): Promise<Celebrity | null> {
    return this.celebrityRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCelebrityDto: Partial<Celebrity>): Promise<Celebrity | null> {
    await this.celebrityRepository.update(id, updateCelebrityDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.celebrityRepository.delete(id);
  }
}
