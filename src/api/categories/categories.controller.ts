import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    ParseIntPipe,
    UsePipes,
    ValidationPipe,
    Query,
  } from '@nestjs/common';
  import { CategoriesService } from './categories.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Role } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/api/auth/decorator/roles.decorator';
import { CategoryQueryDto } from './dto/category-query.dto';
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('categories')
  export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}
  
    @Roles(Role.ADMIN, Role.MANAGER)
    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
      return this.categoriesService.create(createCategoryDto);
    }
  
    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(@Query() query: CategoryQueryDto) {
      return this.categoriesService.findAll(query);
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
      return this.categoriesService.findOne(id);
    }
  
    @Roles(Role.ADMIN, Role.MANAGER)
    @Patch(':id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
      return this.categoriesService.update(id, updateCategoryDto);
    }
  
    @Roles(Role.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
      return this.categoriesService.remove(id);
    }
  }
  