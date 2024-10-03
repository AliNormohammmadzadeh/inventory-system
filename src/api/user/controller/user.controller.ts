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
    Request,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/api/auth/guards/roles.guard';
import { UsersService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Roles } from 'src/api/auth/decorator/roles.decorator';
import { UpdateUserDto } from '../dto/update-user.dto';
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('users')
  export class UsersController {
    constructor(private usersService: UsersService) {}
  
    @Roles(Role.ADMIN)
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }
  
    @Roles(Role.ADMIN)
    @Get()
    async findAll() {
      return this.usersService.findAll();
    }
  
    @Get('me')
    async getProfile(@Request() req) {
      return this.usersService.findOne(req.user.id);
    }
  
    @Roles(Role.ADMIN)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.findOne(id);
    }
  
    @Patch(':id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateUserDto: UpdateUserDto,
      @Request() req,
    ) {
      if (req.user.id !== id && req.user.role !== Role.ADMIN) {
        throw new UnauthorizedException('You can only update your own profile');
      }
      return this.usersService.update(id, updateUserDto);
    }
  
    @Roles(Role.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.remove(id);
    }
  }
  