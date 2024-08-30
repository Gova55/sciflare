import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import initDatabase from './init.db';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  async onModuleInit() {
    try {
      console.log('Initializing database');
      await this.$connect();
      console.log('Prisma connected successfully');
      await initDatabase(this);
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }
}