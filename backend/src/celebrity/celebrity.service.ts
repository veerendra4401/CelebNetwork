import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Celebrity, CelebrityCategory } from './entities/celebrity.entity';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';

interface IMDBWork {
  role: string;
  year: string;
  title: string;
}

@Injectable()
export class CelebrityService implements OnModuleInit {
  private ai: GoogleGenAI;
  private spotifyApi: string;
  private youtubeApi: string;
  private imdbApi: string;
  private lastfmApiKey: string;
  private omdbApiKey: string;

  constructor(
    @InjectRepository(Celebrity)
    private celebrityRepository: Repository<Celebrity>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get('GEMINI_API_KEY');
    console.log('Gemini API Key available:', !!apiKey);
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
    
    // Initialize API endpoints with default empty strings if not configured
    this.spotifyApi = this.configService.get('SPOTIFY_API_KEY') || '';
    this.youtubeApi = this.configService.get('YOUTUBE_API_KEY') || '';
    this.imdbApi = this.configService.get('IMDB_API_KEY') || '';
    
    // Initialize Last.fm API key - using a free API key for development
    this.lastfmApiKey = '43b1a76e5e1a1c9f3c9e8f3e7c8f3e7c'; // Development key
    this.omdbApiKey = '8ec45c2d'; // Free tier key
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

      // 1. Get base information from Gemini
      const prompt = `Create a detailed profile for ${name} including:
      - Full name
      - Category (Singer/Speaker/Actor)
      - Country
      - Instagram handle (without @)
      - Approximate fanbase size
      - Genre/specialties
      - Recent performances/appearances
      - Brief professional description
      Format as JSON with these exact keys: name, category, country, instagram, fanbase, genres, recentPerformances, description`;

      const result = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (!result.text) {
        return null;
      }

      const baseDetails = JSON.parse(result.text.trim());

      // 2. Fetch social media stats and additional data
      const [socialStats, additionalData] = await Promise.all([
        this.fetchSocialStats(name, baseDetails.instagram),
        this.fetchAdditionalData(name, baseDetails.category)
      ]);

      // 3. Combine and format all data
      return this.formatCelebrityDetails({
        ...baseDetails,
        ...additionalData,
        socialStats,
      });
    } catch (error) {
      console.error('Celebrity auto-fill error:', error);
      return null;
    }
  }

  private async fetchSocialStats(name: string, instagramHandle: string): Promise<any> {
    // For development, return simulated data
    return {
      instagram: Math.floor(Math.random() * 1000000) + 100000,
      youtube: Math.floor(Math.random() * 1000000) + 100000,
      spotify: Math.floor(Math.random() * 1000000) + 100000
    };
  }

  private async fetchAdditionalData(name: string, category: string): Promise<any> {
    switch (category.toLowerCase()) {
      case 'singer':
        return this.fetchMusicianData(name);
      case 'actor':
        return this.fetchActorData(name);
      case 'speaker':
        return this.fetchSpeakerData(name);
      default:
        return {};
    }
  }

  private async fetchMusicianData(name: string): Promise<any> {
    try {
      // Using Last.fm API (free with rate limits)
      const response = await axios.get(
        `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(name)}&api_key=${this.lastfmApiKey}&format=json`
      );

      if (response.data?.artist) {
        const artist = response.data.artist;
        return {
          genres: artist.tags?.tag?.map((t: any) => t.name) || [],
          popularity: parseInt(artist.stats?.listeners || '0'),
        };
      }
      return {};
    } catch (error) {
      console.error('Error fetching musician data:', error);
      return {};
    }
  }

  private async fetchActorData(name: string): Promise<any> {
    try {
      // Using OMDb API (free alternative to IMDB)
      const response = await axios.get(
        `http://www.omdbapi.com/?apikey=${this.omdbApiKey}&s=${encodeURIComponent(name)}`
      );

      if (response.data?.Search) {
        const movies = response.data.Search.slice(0, 5);
        return {
          genres: ['Film', 'Television'],
          recentPerformances: movies.map((movie: any) => ({
            date: movie.Year,
            venue: 'Film/TV',
            location: movie.Title
          }))
        };
      }
      return {};
    } catch (error) {
      console.error('Error fetching actor data:', error);
      return {};
    }
  }

  private async fetchSpeakerData(name: string): Promise<any> {
    // For speakers, we'll rely on AI-generated data
    // This could be enhanced with conference API integrations in the future
    return {
      genres: ['Public Speaking', 'Motivational'],
      recentPerformances: []
    };
  }

  private async fetchRecentEvents(name: string): Promise<any[]> {
    try {
      // Using Songkick API (free with rate limits)
      const response = await axios.get(
        `https://api.songkick.com/api/3.0/search/artists.json?apikey=your_api_key&query=${encodeURIComponent(name)}`
      ).catch(() => ({ data: null }));

      if (response?.data?.resultsPage?.results?.artist?.[0]) {
        const artistId = response.data.resultsPage.results.artist[0].id;
        const events = await axios.get(
          `https://api.songkick.com/api/3.0/artists/${artistId}/calendar.json?apikey=your_api_key`
        ).catch(() => ({ data: null }));

        if (events?.data?.resultsPage?.results?.event) {
          return events.data.resultsPage.results.event.map((e: any) => ({
            date: e.start.date,
            venue: e.venue.displayName,
            location: `${e.location.city}, ${e.location.country}`
          }));
        }
      }
      return this.generateSimulatedEvents();
    } catch (error) {
      console.error('Error fetching events:', error);
      return this.generateSimulatedEvents();
    }
  }

  // Simulated data generators for development
  private generateSimulatedFollowers(): number {
    return Math.floor(Math.random() * 1000000) + 100000;
  }

  private generateSimulatedSocialStats(): any {
    return {
      instagram: this.generateSimulatedFollowers(),
      youtube: this.generateSimulatedFollowers(),
      spotify: this.generateSimulatedFollowers()
    };
  }

  private generateSimulatedMusicianData(): any {
    return {
      genres: ['Pop', 'Rock', 'Hip Hop', 'R&B'].sort(() => Math.random() - 0.5).slice(0, 2),
      popularity: this.generateSimulatedFollowers(),
      recentPerformances: this.generateSimulatedEvents()
    };
  }

  private generateSimulatedActorData(): any {
    const movies = [
      'The Great Adventure',
      'Mystery of the Night',
      'Love in Paris',
      'Action Hero 3',
      'The Last Stand'
    ];
    
    return {
      genres: ['Drama', 'Action', 'Comedy', 'Romance'].sort(() => Math.random() - 0.5).slice(0, 2),
      recentPerformances: movies.slice(0, 3).map(title => ({
        date: `202${Math.floor(Math.random() * 4)}`,
        venue: 'Film/TV',
        location: title
      }))
    };
  }

  private generateSimulatedEvents(): any[] {
    const venues = ['Madison Square Garden', 'O2 Arena', 'Hollywood Bowl', 'Royal Albert Hall'];
    const cities = ['New York, USA', 'London, UK', 'Los Angeles, USA', 'Paris, France'];
    
    return Array.from({ length: 3 }, (_, i) => ({
      date: new Date(Date.now() + (i * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      venue: venues[Math.floor(Math.random() * venues.length)],
      location: cities[Math.floor(Math.random() * cities.length)]
    }));
  }

  private formatCelebrityDetails(details: any): Partial<Celebrity> {
    return {
      name: details.name,
      category: details.category as CelebrityCategory,
      country: details.country,
      instagramUrl: `https://instagram.com/${details.instagram}`,
      fanbase: details.fanbase || 1000,
      genres: details.genres || [],
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
