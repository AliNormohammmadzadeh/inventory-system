import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { parentCategoryId, ...data } = createCategoryDto;

    return this.prisma.category.create({
      data: {
        ...data,
        parentCategory: parentCategoryId
          ? { connect: { id: parentCategoryId } }
          : undefined,
      },
    });
  }

  async findAll(query: CategoryQueryDto) {
    const { search, parentCategoryId, page, limit, sortBy, order } = query;

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

    if (parentCategoryId) {
      where.AND.push({ parentCategoryId: parentCategoryId });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }

    const total = await this.prisma.category.count({ where });

    const categories = await this.prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
      include: {
        subCategories: true,
        parentCategory: true,
      },
    });

    return {
      data: categories,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const cacheKey = `category_${id}`;
    
    let category = await this.cacheManager.get(cacheKey);
    if (category) {
      return category;
    }

    // Fetch from database
    category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parentCategory: true,
        subCategories: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.cacheManager.set(cacheKey, category, { ttl: 300 }); 
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { parentCategoryId, ...data } = updateCategoryDto;

    return this.prisma.category.update({
      where: { id },
      data: {
        ...data,
        parentCategory: parentCategoryId
          ? { connect: { id: parentCategoryId } }
          : { disconnect: true },
      },
    });
  }

  async remove(id: number) {
    // Optional: Check if category has products before deleting
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
