import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { CelebrityService } from './celebrity.service';
import { Celebrity } from './entities/celebrity.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('celebrities')
@Controller('celebrities')
@ApiBearerAuth()
export class CelebrityController {
  constructor(private readonly celebrityService: CelebrityService) {}

  @Get('suggest')
  @ApiOperation({ summary: 'Search celebrities using AI' })
  @ApiResponse({ status: 200, description: 'Returns list of potential celebrity matches' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async suggestCelebrities(@Query('description') description: string) {
    try {
      if (!description || description.trim().length === 0) {
        throw new HttpException('Search description is required', HttpStatus.BAD_REQUEST);
      }

      console.log('Controller: Received search request for:', description);
      const results = await this.celebrityService.suggestCelebrities(description);
      console.log('Controller: Received results:', results);
      
      if (!results || results.length === 0) {
        return [];
      }

      return results;
    } catch (error) {
      console.error('Controller Error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to search celebrities',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('autofill/:name')
  @ApiOperation({ summary: 'Auto-fill celebrity details using AI' })
  @ApiResponse({ status: 200, description: 'Returns pre-filled celebrity details' })
  async autoFillCelebrityDetails(@Param('name') name: string) {
    return this.celebrityService.autoFillCelebrityDetails(name);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new celebrity profile' })
  @ApiResponse({ status: 201, description: 'The celebrity profile has been successfully created.', type: Celebrity })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() createCelebrityDto: Partial<Celebrity>): Promise<Celebrity> {
    return this.celebrityService.create(createCelebrityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all celebrities' })
  @ApiResponse({ status: 200, description: 'Return all celebrities.', type: [Celebrity] })
  async findAll(): Promise<Celebrity[]> {
    return this.celebrityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a celebrity by id' })
  @ApiResponse({ status: 200, description: 'Return the celebrity.', type: Celebrity })
  @ApiResponse({ status: 404, description: 'Celebrity not found.' })
  async findOne(@Param('id') id: string): Promise<Celebrity | null> {
    return this.celebrityService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a celebrity profile' })
  @ApiResponse({ status: 200, description: 'The celebrity profile has been successfully updated.', type: Celebrity })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Celebrity not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateCelebrityDto: Partial<Celebrity>,
  ): Promise<Celebrity | null> {
    return this.celebrityService.update(id, updateCelebrityDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a celebrity profile' })
  @ApiResponse({ status: 200, description: 'The celebrity profile has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Celebrity not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.celebrityService.remove(id);
  }

  @Post('autofill')
  @ApiOperation({ summary: 'Auto-fill celebrity details using AI and external APIs' })
  @ApiResponse({ status: 200, description: 'Returns auto-filled celebrity details.' })
  async autoFillDetails(@Body('name') name: string): Promise<Partial<Celebrity> | null> {
    return this.celebrityService.autoFillCelebrityDetails(name);
  }
} 