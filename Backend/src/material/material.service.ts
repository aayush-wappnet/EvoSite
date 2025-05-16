import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { VendorService } from '../vendor/vendor.service';
import { SiteService } from '../site/site.service';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
    private vendorService: VendorService,
    private siteService: SiteService,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    // Verify vendor and site exist
    await this.vendorService.findOne(createMaterialDto.vendorId);
    await this.siteService.findOne(createMaterialDto.siteId);
    
    const material = this.materialRepository.create(createMaterialDto);
    return this.materialRepository.save(material);
  }

  async findAll(): Promise<Material[]> {
    return this.materialRepository.find({
      relations: ['vendor'],
    });
  }

  async findOne(id: string): Promise<Material> {
    const material = await this.materialRepository.findOne({
      where: { id },
      relations: ['vendor'],
    });
    
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    
    return material;
  }

  async update(id: string, updateMaterialDto: UpdateMaterialDto): Promise<Material> {
    const material = await this.findOne(id);
    Object.assign(material, updateMaterialDto);
    return this.materialRepository.save(material);
  }

  async remove(id: string): Promise<void> {
    const material = await this.findOne(id);
    await this.materialRepository.remove(material);
  }
}