import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CelebrityService } from './celebrity.service';
import { Celebrity } from './entities/celebrity.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('celebrities')
@Controller('celebrities')
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
  @ApiOperation({ summary: 'Create a new celebrity' })
  @ApiResponse({ status: 201, description: 'Celebrity created successfully' })
  async create(@Body() createCelebrityDto: Partial<Celebrity>) {
    return this.celebrityService.create(createCelebrityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all celebrities' })
  @ApiResponse({ status: 200, description: 'Returns list of all celebrities' })
  async findAll() {
    return this.celebrityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get celebrity by ID' })
  @ApiResponse({ status: 200, description: 'Returns celebrity details' })
  async findOne(@Param('id') id: string) {
    return this.celebrityService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update celebrity details' })
  @ApiResponse({ status: 200, description: 'Celebrity updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateCelebrityDto: Partial<Celebrity>,
  ) {
    return this.celebrityService.update(id, updateCelebrityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete celebrity' })
  @ApiResponse({ status: 200, description: 'Celebrity deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.celebrityService.remove(id);
  }
} 