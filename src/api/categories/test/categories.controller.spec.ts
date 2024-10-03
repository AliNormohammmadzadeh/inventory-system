import { PrismaService } from 'src/common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriesController } from '../categories.controller';
import { CategoriesService } from '../categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategory = {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices',
    createdAt: new Date(),
    updatedAt: new Date(),
    parentCategoryId: null,
    subCategories: [],
    parentCategory: null,
  };

  const mockCategoriesService = {
    findOne: jest.fn((id) => {
      if (id === 1) return Promise.resolve(mockCategory);
      else throw new NotFoundException(`Category with ID ${id} not found`);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: {} },
      ],
    })
      .overrideProvider(CategoriesService)
      .useValue(mockCategoriesService)
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a category if found', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockCategory);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if category not found', async () => {
      await expect(controller.findOne(2)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(2);
    });
  });
});
