import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { Material } from './entities/material.entity';
import { VendorModule } from '../vendor/vendor.module';
import { SiteModule } from '../site/site.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Material]),
    VendorModule,
    SiteModule,
  ],
  controllers: [MaterialController],
  providers: [MaterialService],
  exports: [MaterialService],
})
export class MaterialModule {}