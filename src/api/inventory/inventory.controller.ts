import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseGuards,
    Request,
    ParseIntPipe,
  } from '@nestjs/common';
  import { InventoryService } from './inventory.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Role } from '@prisma/client';
import { Roles } from '../auth/decorator/roles.decorator';
import { AdjustInventoryDto } from './dto/update-inventory.dto';
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('inventory')
  export class InventoryController {
    constructor(private inventoryService: InventoryService) {}
  
    @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
    @Post(':productId/adjust')
    async adjustInventory(
      @Param('productId', ParseIntPipe) productId: number,
      @Body() adjustInventoryDto: AdjustInventoryDto,
      @Request() req,
    ) {
      return this.inventoryService.adjustInventory(
        productId,
        adjustInventoryDto,
        req.user.userId,
      );
    }
  
    @Get(':productId')
    async getInventory(@Param('productId', ParseIntPipe) productId: number) {
      return this.inventoryService.getInventory(productId);
    }
  
    @Get(':productId/logs')
    async getInventoryLogs(@Param('productId', ParseIntPipe) productId: number) {
      return this.inventoryService.getInventoryLogs(productId);
    }
  }
  