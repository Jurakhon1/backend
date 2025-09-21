import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusController } from './bonus.controller';
import { BonusService } from './bonus.service';
import { BonusTransaction } from '../entities/bonus-transaction.entity';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BonusTransaction, User, Order])],
  controllers: [BonusController],
  providers: [BonusService],
  exports: [BonusService],
})
export class BonusModule {}
