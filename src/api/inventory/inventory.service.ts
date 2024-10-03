import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ChangeType } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AdjustInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async adjustInventory(
    productId: number,
    adjustInventoryDto: AdjustInventoryDto,
    userId: number,
  ) {
    const { changeType, quantityChanged, reason } = adjustInventoryDto;

    return this.prisma.$transaction(async (prisma) => {
      let inventory = await prisma.inventory.findUnique({
        where: { productId },
      });

      if (!inventory) {
        inventory = await prisma.inventory.create({
          data: {
            productId,
            quantity: 0,
          },
        });
      }

      const previousQuantity = inventory.quantity;
      let newQuantity: number;

      if (changeType === ChangeType.INCREASE) {
        newQuantity = previousQuantity + quantityChanged;
      } else if (changeType === ChangeType.DECREASE) {
        newQuantity = previousQuantity - quantityChanged;
        if (newQuantity < 0) {
          throw new BadRequestException('Inventory quantity cannot be negative');
        }
      } else {
        throw new BadRequestException('Invalid change type');
      }

      await prisma.inventory.update({
        where: { productId },
        data: { quantity: newQuantity },
      });

      await prisma.inventoryLog.create({
        data: {
          changeType,
          quantityChanged,
          previousQuantity,
          newQuantity,
          reason,
          productId,
          changedById: userId,
        },
      });

      return {
        productId,
        previousQuantity,
        newQuantity,
      };
    });
  }

  async getInventory(productId: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
      include: { product: true },
    });
    if (!inventory) {
      throw new NotFoundException(`Inventory for product ID ${productId} not found`);
    }
    return inventory;
  }

  async getInventoryLogs(productId: number) {
    return this.prisma.inventoryLog.findMany({
      where: { productId },
      include: { changedBy: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
