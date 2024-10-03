// src/products/products.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: number) {
    const { categoryId, sku, ...data } = createProductDto;

    const existingProduct = await this.prisma.product.findUnique({
      where: { sku },
    });
    if (existingProduct) {
      throw new ConflictException('SKU already exists');
    }

    return this.prisma.product.create({
      data: {
        ...data,
        sku,
        category: { connect: { id: categoryId } },
        createdBy: { connect: { id: userId } },
      },
    });
  }

  async findAll(query: ProductQueryDto) {
    const {
      search,
      categoryId,
      page,
      limit,
      sortBy,
      order,
      includeInactive,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {
      AND: [],
    };

    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (categoryId) {
      where.AND.push({ categoryId: categoryId });
    }

    if (!includeInactive) {
      where.AND.push({ isActive: true });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }

    const total = await this.prisma.product.count({ where });

    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
      include: { category: true },
    });

    return {
      data: products,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product || !product.isActive) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, userId: number) {
    const { categoryId, sku, ...data } = updateProductDto;

    if (sku) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { sku },
      });
      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException('SKU already exists');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(sku && { sku }),
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        updatedBy: { connect: { id: userId } },
      },
    });
  }

  async remove(id: number) {
    // Soft delete the product
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
