import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    Request,
    ParseIntPipe,
    ValidationPipe,
    UsePipes,
    Query,
  } from '@nestjs/common';
  import { ProductsService } from './products.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Role } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { ProductQueryDto } from './dto/product-query.dto';
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('products')
  export class ProductsController {
    constructor(private productsService: ProductsService) {}
  
    @Roles(Role.ADMIN, Role.MANAGER)
    @Post()
    async create(@Body() createProductDto: CreateProductDto, @Request() req) {
      return this.productsService.create(createProductDto, req.user.userId);
    }
  
    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(@Query() query: ProductQueryDto) {
      return this.productsService.findAll(query);
    }
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
      return this.productsService.findOne(id);
    }
  
    @Roles(Role.ADMIN, Role.MANAGER)
    @Patch(':id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateProductDto: UpdateProductDto,
      @Request() req,
    ) {
      return this.productsService.update(id, updateProductDto, req.user.userId);
    }
  
    @Roles(Role.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
      return this.productsService.remove(id);
    }
  }
  