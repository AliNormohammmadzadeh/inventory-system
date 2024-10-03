import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/user/user.module';
import { CategoriesModule } from './api/categories/categories.module';
import { ProductsModule } from './api/products/products.module';
import { InventoryModule } from './api/inventory/inventory.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT, 10) || 6379,
          ttl: 300, 
        }),
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    InventoryModule,
  ],
})
export class AppModule {}
